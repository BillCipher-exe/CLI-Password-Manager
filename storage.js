let LocalStorage = require('node-localstorage').LocalStorage;
const Cryptr = require("cryptr");
const fs = require("fs");
let table = require("table");
localStorage = new LocalStorage('./save');

//
var term = require( 'terminal-kit' ).terminal ;
let prompt = async ()=>
{

}
//
let data = {content: []};

let print_data = (index) =>
{
    config = 
    {
        columns: 
        {
            0: 
            {
                width: 3
            },
            1: 
            {
                width: 25
            },
            2: 
            {
                width: 30
            },
            3:
            {
                width: 25
            },
            4:
            {
                width: 20
            }
        },
        header: 
        {
            alignment: 'center',
            content: "IN ENCRYPTION WE TRUST",
        }
    }
    let table_content=[];
    table_content.push(["ID", "Plattform", "Description", "Username", "Password"]);
    if(index===undefined)
    {
        for (i in data.content)
        {
        table_item = [i,data.content[i].name,data.content[i].descr,data.content[i].usr,data.content[i].pw];
        table_content.push(table_item);
        }
    }
    else
    {
        for(i in index)
        {
            table_item = [i,data.content[index[i]].name,data.content[index[i]].descr,data.content[index[i]].usr,data.content[index[i]].pw];
            table_content.push(table_item);
        }
    }
    
    console.log("\n"+table.table(table_content, config));
}
   
let write_data = async () =>
{    
    let new_data={};
    term("\nPlattform: ");
    new_data.name = await term.inputField().promise;
    if(new_data.name===null)
    {
        new_data.name="NULL";
    }
    term("\ndescription: ");
    new_data.descr = await term.inputField().promise;
    term("\nusername: ");
    new_data.usr = await term.inputField().promise;
    term("\npassword: ");
    new_data.pw = await term.inputField().promise;
    data.content.push(new_data);
}

let delete_data = async () =>
{
    print_data();
    term("which line to delete: ");
    let line = await term.inputField().promise;
    data.content.splice(line,1);
}

let search_data = async () =>
{
    term("\nsearch: ");
    let search = await term.inputField().promise;
    let index_match=[];
    for(i in data.content)
    {
        if(data.content[i].name.match(search))
        {
            index_match.push(i);
        }
    }
    print_data(index_match);
}


let main = async ()=>
{
    if(!fs.existsSync("./save/data"))
    {   try
        {
            term("SETUP Password: ");
            const key_init =  await term.inputField().promise;
            let cryptr_init = new Cryptr(key_init);
            localStorage.setItem("data",cryptr_init.encrypt(JSON.stringify(data)));
            process.exit();
        }
        catch(error)
        {
            console.log("Password cant be Empty. Try again.")
        }    
    }
    else
    {
        term("Password: ");
        const key_string =  await term.inputField().promise;
        try
        {
            let cryptr = new Cryptr(key_string);
            data = JSON.parse(cryptr.decrypt(localStorage.getItem("data")));
        
            let input = ""
            print_data();
            while (input!="q")
            {
                console.log("|p: print all|   |w: write|    |d: delete|  |s: search|   |q: quit|");
                term("\Input: ");
                input =  await term.inputField().promise;
                switch(input)
                {
                    case "p": print_data();break;
                    case "w": await write_data();localStorage.setItem("data",cryptr.encrypt(JSON.stringify(data)));break;
                    case "d": await delete_data();localStorage.setItem("data",cryptr.encrypt(JSON.stringify(data)));break;
                    case "s": await search_data();break;
                    case "q": input = "q";break;
                    default:break;
                }
            }
            process.exit();
        }
        catch(error)
        {
            console.log("wrong password fool");
            process.exit();
        }    
    }
}

main();