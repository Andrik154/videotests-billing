const e = require('express');
const express = require('express');
const router = express.Router();
const request = require('request');
const crypto = require('crypto');
const db = require('../connectdb.js');

router.post('/addtest', (req,res)=>{
    if (req.body.pass != process.env.PASS){
        res.json({
            "success":false
        })
    }
    let id = parseInt(req.body.id);
    let answers = req.body.answers;
    let questions = req.body.questions || "";
    let misc = req.body.misc || "";
    let price = parseInt(req.body.price) || 3000;
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
router.use('/gettestlist', (req,res)=>{
    res.json({"10":[{"name":"cringe","stats":"10/10", "done by":"10.06.2004", "id":13372329},{"name":"Elektichestvo", "stats":"9/10", id:14882281337}]});
})
router.post('/test',(req,res)=>{
    let id = req.body.id;
    if(id){
        db.query({text:"SELECT price FROM public.tests WHERE id=$1", values:[id]}, (err, resq)=>{
            if (err){
                res.json({
                    success:false
                })        
            } else {
                let p = resq.length>0&&resq[0].price;
                res.json({
                    success:true,
                    exists: p
                })
            }
        })
    } else {
        res.json({
            success:false
        })
    }
})
router.post('/purchasetest', (req,res)=>{
    let login = req.body.login;
    let test = req.body.test;
    if(login && test){
        db.query({text:`
            select (
                select cash
                from public.users
                where login=$1
            ) as cash,
            (
                select price
                from public.tests
                where id=$2
            ) as price
        `, values:[login, test]}, (err, resq)=>{
            if(err){
                res.json({
                    success:false
                })
            } else {
                let cash = resq[0].cash;
                let price = resq[0].price;
                if(price>cash){
                    res.json({
                        success:false
                    })            
                } else {
                            db.query({text:`insert into public.orders(type,price,details,customer) values('test',$1,$2,$3);`,values:[price,test,login]},(err,resq)=>{
                                if (err){
                                    res.json({
                                        success:false
                                    })                    
                                } else {
                                    db.query({text:`select answers from public.tests where id=$1`, values:[test]},(err,resq)=>{
                                        if (err){
                                            res.json({
                                                success:false
                                            })                    
                                        } else {
                                            var ans = JSON.parse(resq[0].answers);
                                            request.post({
                                                url:"https://videouroki.net/et/pupil-api/auth",
                                                method:"post",
                                                headers:{
                                                    'content-type':'application/json;charset=UTF-8',
                                                    'origin':'https://videouroki.net',
                                                    'referer':'https://videouroki.net/et/pupil',
                                                    'sec-ch-ua':"\"Chromium\";v=\"92\", \" Not A;Brand\";v=\"99\", \"Google Chrome\";v=\"92\"",
                                                    'user-agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36',
                                                    'x-requested-with':'XMLHttpRequest'
                                                },
                                                json:{
                                                    "pupil":{
                                                        "login":req.body.login,
                                                        "pass":req.body.pass
                                                    }
                                                }
                                            }, (err,r,b)=>{
                                                var phpsessid = r.headers['set-cookie'][0].split(';')[0].split('=')[1];
                                                request.get({
                                                    url:"https://videouroki.net/et/pupil",
                                                    method:"get",
                                                    headers:{
                                                        'cookie':`PHPSESSID=${phpsessid};`
                                                    }
                                                }, (err, r, b)=>{
                                                    var backend = JSON.parse(b.match(/{"pupil.+}/));
                                                    var testData = backend.pupil.tests.find(e=>e.test.fakeId==parseInt(test));
                                                    if (backend){
                                                        request.post({
                                                            url:"https://videouroki.net/tests/api/beginTest/"+test,
                                                            headers:{
                                                                'cookie':`PHPSESSID=${phpsessid};`
                                                            },
                                                            json:{
                                                                member:backend.pupil,
                                                                test: testData
                                                            }
                                                        }, (err,r,b)=>{
                                                            var id = b.id;
                                                            var uuid = b.uuid;
                                                            var ps = [];
                                                            var url = `https://videouroki.net/tests/api/save/${id}`;
                                                            for (let aa of ans){
                                                                let p = new Promise((resolve,reject)=>{
                                                                    var a = aa;
                                                                    var payload = {"answer":{"id": a.taskId,"variants": a.answer},"member": {"fakeId":id, "uuid":uuid}};
                                                                    request.post({
                                                                        url: url,
                                                                        json:payload
                                                                    }, (err,r,b)=>{
                                                                        err?reject():resolve();
                                                                    });
                                                                })
                                                                ps.push(p);
                                                            }
                                                            Promise.all(ps).then(
                                                                r=>{
                                                                    db.query({text:`
                                                                                update public.users
                                                                                set cash = cash - $1
                                                                                where login = $2;`,values:[price,login]},
                                                                    (err,resq)=>{
                                                                        if (err){
                                                                        res.json({
                                                                            success:false
                                                                        })
                                                                        } else 
                                                                        {   
                                                                            let dur = (testData.duration-1)*60;
                                                                            let rand = Math.floor(Math.random()*(1*60)+dur-1*60);
                                                                            let link = `https://videouroki.net/tests/complete/${uuid}`;
                                                                            setTimeout((u)=>request.get(u),rand*1e3,link);
                                                                            res.json({
                                                                                "success":true
                                                                            })
                                                                        }
                                                                    })
                                                                }
                                                            ).catch(e=>{
                                                                console.log(e)
                                                                res.json({
                                                                    "success":false
                                                                })
                                                            })
                                                        })
                                                    } else {
                                                        res.json({
                                                            "success":false
                                                        })
                                                    }
                                                })
                                                })
                                        }
                                        })
                                    }})
                                }
                        }})
    } else {
        res.json({
            success:false
        })        
    }
})
router.post('/getdata', (req,res)=>{
    let phpsessid = req.body.PHPSESSID || null;
    if (phpsessid){
        request.get({
            url:"https://videouroki.net/et/pupil",
            method:"get",
            headers:{
                'cookie':`PHPSESSID=${phpsessid};`
            }
        }, (err, r, b)=>{
            if(err){
                res.json({
                    "success":false
                })
            } else {
                let backend = JSON.parse(b.match(/{"pupil.+}/));
                if (backend){
                    res.json({"success":true,"backend":backend});
                } else {
                    res.json({
                        "success":false
                    })
                }
            }
        })
    } else {
        res.json({
            "success":false
        })
    }
})
router.post('/getcash', (req,res)=>{
    let login = req.body.login;
    db.query({text:"SELECT * FROM public.users WHERE login=$1",values:[login]},(err,resq)=>{
        if (err){
            res.json({"success":false})
        } else {
            res.json({"success":true,"cash":resq[0].cash});
        }
    })
})
router.post('/promo', (req,res)=>{
    const promo = req.body.promo;
    if(promo){
        db.query({text:"SELECT multiplier FROM public.promos WHERE promo=$1",values:[promo]},(err,resq)=>{
            if(err){
                res.json({
                    success: false
                })
            } else if (resq.length==0){
                res.json({
                    success:true,
                    goodPromo:false,
                    multiplier:1.0
                })
            } else {
                res.json({
                    success:true,
                    goodPromo:true,
                    multiplier:parseFloat(resq[0].multiplier)
                })
            }
        })
    } else {
        res.json({
            success: false
        })
    }
})
router.post('/paymentqiwiapi', (req,res)=>{
    console.log('paymentqiwiapi')
    let myhash = crypto.createHmac('sha256', process.env.QIWISKEY);
    let data = req.body.bill;
    let hash = req.headers['X-Api-Signature-SHA256'.toLocaleLowerCase()];
    let invoice_parameters = `${data.amount.currency}|${data.amount.value}|${data.billId}|${data.siteId}|${data.status.value}`;
    let myhashv = myhash.update(invoice_parameters).digest('hex');
    if(hash==myhashv){
        new Promise((resolve,reject)=>{
            if (data.customFields.promo!=undefined){
                var multiplier = 1.0;
                db.query({text:'SELECT multiplier FROM public.promos WHERE promo=$1', values:[data.customFields.promo]},(err,resq)=>{
                    if(err){
                        reject();
                        res.sendStatus(500);
                    } else {
                        multiplier = resq[0].multiplier;
                        resolve(multiplier);
                        console.log(multiplier);
                    }
                })
            } else {
                var multiplier = 1.0;
                resolve(multiplier);
            }    
        }).then(multiplier=>{
            var finalAmount = parseInt(parseFloat(data.amount.value)*multiplier*100);
            db.query({text:"INSERT INTO public.orders(type,price,details,customer) VALUES('payment',$1,$2,$3)",values:[finalAmount,data.billId,data.customer.account]}, (err,resq)=>{
                if(err){
                    console.log(`${err}, ${data}`)
                }
            });
            db.query({text:'UPDATE public.users SET cash = cash + $1 WHERE login=$2', values:[finalAmount, data.customer.account]}, (err,resq)=>{
                if(err){
                    res.sendStatus(500);
                } else {
                    res.sendStatus(200);
                }
            })
        }).catch(e=>res.sendStatus(500));
    } else {
        res.sendStatus(406);
    }

})
router.post('/signin', (req,res)=>{
    request.post({
        url:"https://videouroki.net/et/pupil-api/auth",
        method:"post",
        headers:{
            'content-type':'application/json;charset=UTF-8',
            'origin':'https://videouroki.net',
            'referer':'https://videouroki.net/et/pupil',
            'sec-ch-ua':"\"Chromium\";v=\"92\", \" Not A;Brand\";v=\"99\", \"Google Chrome\";v=\"92\"",
            'user-agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36',
            'x-requested-with':'XMLHttpRequest'
        },
        json:{
            "pupil":{
                "login":req.body.pupil.login,
                "pass":req.body.pupil.pass
            }
        }
    }, (err,r,b)=>{
        if(b.response.message=="success" && b.errors==false){
            db.query({text:"INSERT INTO users(login,pass,cash) VALUES ($1, $2, 0) ON CONFLICT DO NOTHING",values:[req.body.pupil.login,req.body.pupil.pass]},(err,resq)=>{
                if (err){
                    res.json({
                        "success":false,
                    })
                } else {
                    let cookie = r.headers['set-cookie'][0].split(';')[0].split('=')[1];
                    res.json({
                        "success":true,
                        "PHPSESSID":cookie,
                        "lul":resq
                    })
                }
            })
        } else {
            res.json({
                "success":false
            })
        }
    })
})
module.exports = router;