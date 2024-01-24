let mysql=require('sqlite3');
let {open}=require('sqlite');
let cros=require('cors')
let exp=require('express');
let app=exp()
app.use(exp.json())
let path=require('path');
let db=path.join(__dirname,"sqlie.db");
let kdb=null
app.use(cros())
let server=async()=>{
    try{
       kdb= await open({
            filename:db,
            driver: mysql.Database
        });
        console.log(kdb)
        app.listen(4000,()=>{console.log('app started at 4000')})
    }
    catch(err){
        console.log(err)
    }
}

server();
app.post('/post', async (req,resp)=>{
    const k=function(){ 
        console.log('entered post')
        req.body.map((each)=>{ const id=each.id
            const title=each.title
            const price=each.price
            const description=each.description
            const category=each.category
            const image=each.image
            const sold=each.sold
            const dateOfSale=each.dateOfSale
    
            const quer=` insert into roxilerdata (id,title,price,description,category,image,sold,dateOfSale) values (?,?,?,?,?,?,?,?)`
        
            kdb.run(quer,[id,title,price,description,category,image,sold,dateOfSale],(err,result)=>{
                if(err) throw err
            })
            return 0
        })}
    const l= await k()
    resp.send('done')
})  
    

    app.get('/:Id',async (req,resp)=>{
        const {Id}=req.params
        console.log(Id)
       const quer= `select * from roxilerdata where strftime("%m",dateOfSale)='${Id}'`
       let l=await kdb.all(quer)
       resp.send(l)
    })
    
    app.get('/monthlyreport/:Id',async(req,resp)=>{
    const {Id}=req.params
        const quer=`select sum(price) totalpurchase,count(id) as noofproducts,case 
        when sold=0 then 'notsold'
        else 'sold'
        end as sstatus
        from roxilerdata where strftime('%m',dateOfSale)='${Id}' group by sold`
        const resu=await kdb.all(quer)
        resp.send(resu)
    })
    
    
    app.get('/productrange/:Id',async (req,resp)=>{
        let {Id}=req.params
        let quer=`select sum(price) totalpurchase,count(id) as noofproducts,case 
        when price>0 and price <=100 then '0-100'
        when price>100 and price<=200 then '101-200'
        when price>200 and price<=300 then '201-300'
        when price>300 and price<=300 then '301-400'
        when price>400 and price<=500 then '401-500'
        when price>500 and price<=600 then '501-600'
        when price>600 and price<=700 then '601-700'
        when price>700 and price<=800 then '701-800'
        when price>800 and price<=900 then '801-900'
        else '901-above'
        end as pricerange
        from roxilerdata where strftime('%m',dateOfSale)='${Id}' group by pricerange`
   let resyr= await kdb.all(quer)
resp.send(resyr)
    })
    
    app.get('/distinctproduct/:Id',async (req,resp)=>{
        let {Id}=req.params
        let quer=`select distinct category as category , count(id) as no_of_product from roxilerdata where strftime("%m",dateOfSale)='${Id}' group by category`
       let resuuy=await kdb.all(quer);
       resp.send(resuuy)
    })
    
    