const express = require('express');
const cors = require('cors');
const axios = require('axios');
const multer = require('multer');
const upload = multer();
const app = express();
app.use(cors()); app.use(express.json());
const PORT = process.env.PORT || 4000;
app.get('/api/health',(req,res)=>res.json({ok:true}));
app.post('/api/translate', async (req,res)=>{ const { text, to } = req.body; if(!text) return res.status(400).json({error:'text required'});
try{ const response = await axios.post('https://libretranslate.com/translate',{q:text,source:'auto',target:to||'en',format:'text'},
{headers:{'accept':'application/json','Content-Type':'application/json'}});
return res.json({translatedText: response.data.translatedText});}catch(e){return res.json({translatedText:text+' (translation failed)'});}});
app.listen(PORT,()=>console.log(`Backend running on http://localhost:${PORT}`));