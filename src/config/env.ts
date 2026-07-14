import dotenv from 'dotenv'
dotenv.config()


function required(key:string){
    const environmentValue = process.env[key]

    if(!environmentValue){
        throw new Error(`missing env value ${environmentValue}`)
    }
    return environmentValue
}

function optional(key:string , fallback:string) {
    return process.env[key] || fallback
}

export const env = {
    isDev : optional('development' , 'production'),
    MONGO_URL:required("MONGO_URL"),
    PORT:Number(optional("PORT" , "5000")),
    SALT_ROUND:Number(optional("SALT_ROUND", "10")),
    JWT_SECRET:required("JWT_SECRET"),
    REDIS_URL:required("REDIS_URL"),
    JWT_REFRESH:required("JWT_REFRESH"),
    CLIENT_URL:optional("CLIENT_URL" , "http://localhost:5173/")
}