const axios = require('axios');

export default async function apiRequestHandler(req,res) {
    try {
        const { method } = req;
        const baseUrl = 'https://api.styler.digital';
        //const baseUrl = 'http://localhost:8080'
        const apiRoute = req.url.replace('/api/external', baseUrl);
        let response;
        switch(method) {
          case "GET":
            response = await axios.get(apiRoute); 
            break;
          case "POST":
            const { body } = req;
            response = await axios.post(apiRoute, body);
            break;
          default:
            res.status(405).json({ status: 'failed', message: `Method ${method} is not allowed` });
            return;
        }
        res.status(200).json(response.data);
      } catch(e) {
        if(e.response) {
          res.status(e.response.status).json(e.response.data);
        } else {
          console.log(e);
          res.status(500).json({ status: 'failed', message: 'Internal edge server error' });
        }
    }
}