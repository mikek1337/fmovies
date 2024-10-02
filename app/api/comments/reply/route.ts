export async function POST(req:Request){
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if(!id){
        return new Response('Bad Request', {status:400});
    }
    const body = Cawait req.json();
}