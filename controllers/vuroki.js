const r = require('request-promise-native');

const vuroki = {
    uri: 'https://videouroki.net',
    getSession: async function (credentials){
        const res = await r({
            uri: this.uri+'/et/pupil-api/auth',
            method: 'POST',
            headers:{
                'content-type':'application/json;charset=UTF-8',
                'origin':'https://videouroki.net',
                'referer':'https://videouroki.net/et/pupil',
                'sec-ch-ua':"\"Chromium\";v=\"92\", \" Not A;Brand\";v=\"99\", \"Google Chrome\";v=\"92\"",
                'user-agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36',
                'x-requested-with':'XMLHttpRequest'
            },
            body: {
                "pupil":{
                    "login":credentials.login,
                    "pass":credentials.pass
                }
            },
            json: true,
            resolveWithFullResponse: true
        }).catch(e=>{throw new Error(e)});
        const cookie = res.headers['set-cookie'][0].split(';')[0].split('=')[1];
        if(res.body.response.message==='success'){
            return cookie;
        } else {
            throw new Error('Incorrent login/pass');
        }
    },
    getBackend: async function (session){
        const html = await r({
            uri: this.uri+'/et/pupil',
            method: 'GET',
            headers: {
                'cookie':`PHPSESSID=${session};`
            }
        }).catch(e=>{throw new Error(e)});
        const backend = JSON.parse(html.match(/{"pupil.+}/));
        if (backend){
            return backend;
        } else {
            throw new Error('Probably bad sessid');
        }
    },
    beginTest: async function(credentials, id){
        const session = await this.getSession(credentials).catch(e=>{throw new Error(e)});
        const backend = await this.getBackend(session).catch(e=>{throw new Error(e)});
        const testData = backend.pupil.tests.find(e=>e.test.fakeId==parseInt(id));
        const res = await r({
            uri: this.uri+'/tests/api/beginTest/'+id,
            method:'POST',
            headers:{
                'cookie':`PHPSESSID=${session};`
            },
            json:true,
            body:{
                member: backend.pupil,
                test: testData
            }
        }).catch(e=>{throw new Error(`Error beginning test user ${credentials.login}: ${e}`)});
        return {testData, id: res.id, uuid: res.uuid};
    },
    createAnswerPayload: function(a, id, uuid){
        return {"answer":{"id": a.taskId,"variants": a.answer},"member": {"fakeId":id, "uuid":uuid}};
    },
    saveAnswer: async function(id, payload){
        const res = await r({
            uri: this.uri+'/tests/api/save/'+id,
            method:'POST',
            json:true,
            body:{
                ...payload
            }
        }).catch(e=>{throw new Error(`Error answering for task ${payload.answer.id} uuid ${payload.member.uuid}: ${e}`)});
    },
    completeTest: async function(uuid){
        const res = await r({
            uri: this.uri+'/tests/complete/'+uuid,
            method:'GET',
        }).catch(e=>{throw new Error(`Error completing test uuid ${uuid}: ${e}`)});
    }
}

module.exports = vuroki;