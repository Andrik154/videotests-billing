const express = require('express');
const router = express.Router();
const request = require('request');
const crypto = require('crypto');
const { join, dirname } = require('path');

const db = require('../connectdb.js');
const vu = require('../controllers/vuroki');

const testTasks = join(__dirname, '..', 'testsTasks.json');

var handling = [];

(async()=>{
    const{ Low, JSONFile } = await import('lowdb');
    const adapter = new JSONFile(testTasks);
    const ldb = new Low(adapter);
    await ldb.read();
    ldb.data = ldb.data || {"tasks":[], "handling":[]};
    await ldb.write();
    global.ldb = ldb;

    await Promise.all(ldb.data.tasks.map(function(e){
        return Promise.all([
            ...e.ans.map(function(a){
                return vu.saveAnswer(e.id, vu.createAnswerPayload(a,e.id,e.uuid));
            }),
            setTimeout((async(uuid)=>{await vu.completeTest(uuid)}), (e.t-Date.now()),e.uuid),
        ])
    }));
    ldb.data =  {"tasks":[], "handling":[]};
    await ldb.write();

})()

router.post('/adminauth', (req,res)=>{
    if(req.body.pass==process.env.ADMINPASS){
        res.json({success:true});
    } else {
        res.json({success: false});
    }
})
router.post('/adminlistpromos', (req,res)=>{
    if(req.body.pass==process.env.ADMINPASS){
        db.queryAs({text:'SELECT * FROM public.promos ORDER BY multiplier DESC'}).then(r=>{
            res.json({success:true, promos:r});
        })
    } else {
        res.json({success:false})
    }
})
router.post('/adminaddpromo', (req,res)=>{
    if(req.body.pass==process.env.ADMINPASS && req.body.promo && req.body.multiplier){
        db.queryAs({text:'INSERT INTO public.promos(promo, multiplier) VALUES($1, $2)', values:[req.body.promo, parseFloat(req.body.multiplier)]}).then(r=>{
            res.json({success:true});
        }).catch(e=>{console.log(e); res.json({success:false, error: e})});
    } else {
        res.json({success:false})
    }
})
router.post('/adminremovepromo', (req,res)=>{
    if(req.body.pass==process.env.ADMINPASS && req.body.promo){
        db.queryAs({text:'DELETE FROM public.promos WHERE promo=$1', values:[req.body.promo]}).then(r=>{
            res.json({success:true});
        }).catch(e=>{console.log(e); res.json({success:false, error: e})});
    } else {
        res.json({success:false})
    }
})
router.post('/adminlistorders', (req,res)=>{
    if(req.body.pass==process.env.ADMINPASS && req.body.number){
        db.queryAs({text:'SELECT * FROM public.orders ORDER BY id DESC LIMIT $1', values:[parseInt(req.body.number)]}).then(r=>{
            res.json({success:true, orders:r});
        })
    } else {
        res.json({success:false})
    }
})
router.post('/addtest', (req,res)=>{
    if (req.body.pass != process.env.PASS){
        res.json({
            "success":false
        })
    }
    let id = parseInt(req.body.id);
    let answers = req.body.answers || JSON.stringify([]);
    let questions = req.body.questions || "";
    let misc = req.body.misc || "";
    let price = parseInt(req.body.price) || 1500;
    db.query({text:"INSERT INTO tests(id, answers, questions, misc, price) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO UPDATE SET answers=$2, questions=$3, misc=$4, price=$5", values:[id, answers, questions, misc, price]}, (err,resq)=>{
        if (err){
            res.json({
                "success":false,
            })
        } else {
            res.json({
                "success":true,
                "resq":resq
            })
        }
    })
})
router.post('/updateans', (req,res)=>{
    if (req.body.pass != process.env.PASS){
        return res.json({
            "success":false
        })
    }
    let id = parseInt(req.body.id);
    let answer = req.body.answer;
    db.queryAs({text:'select answers from public.tests where id=$1', values:[id]}).then(r=>{
        var currentans = JSON.parse(r[0].answers);
        if (currentans.findIndex(e=>e.taskId==answer.taskId)>-1){
            return res.json({success:false});
        }
        currentans = [...currentans, ...answer];
        return db.queryAs({text:'update public.tests set answers=$1 where id=$2', values:[JSON.stringify(currentans),id]})
    })
    .then(r=>{
        res.json({
            success:true
        })
    })
    .catch(e=>{
        console.log(`Error pushing ans: ${e}`);
        res.json({
            success:false
        })
    });
    
})
router.use('/gettestlist', (req,res)=>{
    res.json({"10":[{"name":"cringe","stats":"10/10", "done by":"10.06.2004", "id":13372329},{"name":"Elektichestvo", "stats":"9/10", id:14882281337}]});
})
router.post('/test',(req,res)=>{
    const id = req.body.id || undefined;
    if(id==undefined){
        return res.json({success:false});
    }
    db.queryAs({text:"SELECT price FROM public.tests WHERE id=$1", values:[id]}).then(r=>{
        const p = r.length>0&&r[0].price;
        res.json({success:true, exists: p});
    }).catch(e=>{console.log(e);res.json({success:false, error: e})});
})
router.post('/purchasetest', (req,res)=>{
    const login = req.body.login || undefined;
    const test = req.body.test || undefined;
    const pass = req.body.pass || undefined;
    if(handling.indexOf({login, test, pass})>-1){
        return res.json({success:false, fatal:false});
    }
    if (!login || !test || !pass){
        return res.json({success:false, fatal: false});
    }
    db.queryAs({text:'select (select cash from public.users where login=$1) as cash, (select price from public.tests where id=$2) as price', values:[login, test]})
        .then(r=>{
            const cash = r[0].cash;
            const price = r[0].price;
            if (price>cash){
                throw new Error('Not enough money');
            }
            return Promise.all([
                db.queryAs({text:`insert into public.orders(type,price,details,customer) values('test',$1,$2,$3);`,values:[price,test,login]}),
                db.queryAs({text:`select answers from public.tests where id=$1`, values:[test]}),
                db.queryAs({text:`update users set cash=cash-$1 where login=$2`, values:[price,login]}),
                vu.beginTest({login, pass}, test)
            ])
        })
        .then(r=>{
            const ans = JSON.parse(r[1][0].answers);
            const {testData, id, uuid} = r[2];
            const dur = (testData.duration-1.3)*60;
            const t = Math.floor(Math.random()*(1*60)+dur-1*60);
            const parray = [{uuid, t}];
            ldb.data.tasks.push({t:Date.now()+t*1000,uuid,id,ans});
            for (const a of ans){
                const p = vu.createAnswerPayload(a, id, uuid);
                parray.push(
                    vu.saveAnswer(id, p)
                );
            }
            parray.push(ldb.write());
            return Promise.all(parray);
        })
        .then(r=>{
            const {uuid, t} = r[0];
            setTimeout((async(uuid)=>{await vu.completeTest(uuid)}), t*1000, uuid);
            handling.splice(handling.findIndex(e=>(e.login==login&&e.test==test)));
            res.json({success:true, t: t});
        })
        .catch(e=>{
            console.log(`Error completing test: ${e}`);
            handling.splice(handling.findIndex(e=>(e.login==login&&e.test==test)));
            res.json({success: false, error: e.toString(), fatal: true});
        })
})
router.post('/getdata', (req,res)=>{
    const phpsessid = req.body.PHPSESSID || undefined;
    if(phpsessid === undefined){
        return res.json({
            success: false
        })
    }
    vu.getBackend(phpsessid).then(backend=>{
        res.json({success: true, backend});
    }).catch(e=>{console.log(e); res.json({success:false, error: e})});
})
router.post('/getcash', (req,res)=>{
    const login = req.body.login || undefined;
    if(login===undefined){
        return res.json({success: false});
    }
    db.queryAs({text:"SELECT * FROM public.users WHERE login=$1",values:[login]}).then(r=>{
        res.json({success: true, cash: r[0].cash});
    }).catch(e=>{console.log(e); res.json({success:false, error: JSON.stringify(e)})});
})
router.post('/promo', (req,res)=>{
    const promo = req.body.promo || undefined;
    if(promo===undefined){
        return res.json({
            success: false
        })
    }
    db.queryAs({text:"SELECT multiplier FROM public.promos WHERE promo=$1",values:[promo]}).then(r=>{
        r.length==0?res.json({success:true, goodPromo: false, multiplier: 1.0}):res.json({success:true, goodPromo: true, multiplier: r[0].multiplier});
    }).catch(e=>{console.log(e); res.json({success:false, error: e})});
})
router.post('/paymentqiwiapi', (req,res)=>{
    console.log('paymentqiwiapi')
    const data = req.body.bill || undefined;
    const hash = req.headers['X-Api-Signature-SHA256'.toLocaleLowerCase()] || undefined;
    if (!data || !hash){
        return res.json({success: false});
    }
    let myhash = crypto.createHmac('sha256', process.env.QIWISKEY);
    let invoice_parameters = `${data.amount.currency}|${data.amount.value}|${data.billId}|${data.siteId}|${data.status.value}`;
    let myhashv = myhash.update(invoice_parameters).digest('hex');
    if(hash==myhashv){
        new Promise((resolve,reject)=>{
            if (data.customFields.promo!=undefined){
                db.queryAs({text:'SELECT multiplier FROM public.promos WHERE promo=$1', values:[data.customFields.promo]}).then(multiplier=>{
                    resolve(multiplier);
                }).catch(e=>{reject(new Error(e))});
            }
            resolve(1.0);
        })
        .then(multiplier=>{
            var finalAmount = parseInt(parseFloat(data.amount.value)*multiplier*100);
            Promise.all([
                db.queryAs({text:"INSERT INTO public.orders(type,price,details,customer) VALUES('payment',$1,$2,$3)",values:[finalAmount,data.billId,data.customer.account]}),
                db.queryAs({text:'UPDATE public.users SET cash = cash + $1 WHERE login=$2', values:[finalAmount, data.customer.account]})
            ])
                .then(v=>{console.log(`Payment authorized; ${data.billId}`); res.sendStatus(200);})
                .catch(e=>{console.log(`Error in database handling; ${e}`); res.sendStatus(500);});
        }).catch(e=>{console.log(`Error getting multiplier: ${e}`); res.sendStatus(500);});
    } else {
        res.sendStatus(406);
    }
})
router.post('/signin', (req,res)=>{
    const pupil = req.body.pupil || {};
    const login = pupil.login || undefined;
    const pass = pupil.pass || undefined;
    if (login!==undefined && pass!==undefined){
        vu.getSession({login, pass}).then(session=>{
            db.queryAs({text:"INSERT INTO users(login,pass,cash) VALUES ($1, $2, 0) ON CONFLICT DO NOTHING",values:[login, pass]}).then(r=>{
                res.json({success:true, PHPSESSID:session});
            }).catch(e=>{console.log(e); res.json({success:false, error: e});});
        }).catch(e=>{console.log(e); res.json({success:false, error: e});});
    } else {
        res.json({success:false});
    }
})
module.exports = router;