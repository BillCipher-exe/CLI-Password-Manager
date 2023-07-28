let LocalStorage = require('node-localstorage').LocalStorage;
const Cryptr = require("cryptr");
const prompt = require("prompt-sync")();
const fs = require("fs");
let table = require("table");
localStorage = new LocalStorage('./save');

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
    
    console.log(table.table(table_content, config));
}
   
let write_data = () =>
{
    console.log("write data");
    
    let new_data={};
    new_data.name = prompt("plattform: ");
    if(new_data.name===null)
    {
        new_data.name="NULL";
    }
    new_data.descr = prompt("description: ");
    new_data.usr = prompt("username: ");
    new_data.pw = prompt("password: ");
    data.content.push(new_data);
}

let delete_data = () =>
{
    print_data();
    console.log("which record do you want to delete: ")
    let line = prompt("Input line ID: ")
    data.content.splice(line,1);
}

let search_data = () =>
{
    let search = prompt("search Plattform: ");
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

if(!fs.existsSync("./save/data"))
{   try
    {
        const key_init = prompt("set your password: ");
        let cryptr_init = new Cryptr(key_init);
        localStorage.setItem("data",cryptr_init.encrypt(JSON.stringify(data)));
    }
    catch(error)
    {
        console.log("Password cant be Empty. Try again.")
    }    
}
else
{

    const key_string = prompt("Password: ");
    try
    {
        let cryptr = new Cryptr(key_string);
        data = JSON.parse(cryptr.decrypt(localStorage.getItem("data")));
    
        let input = ""
        print_data();
        while (input!="q")
        {
            console.log("|p: print all|   |w: write|    |d: delete|  |s: search|   |q: quit|");
            input = prompt("input: ");
            switch(input)
            {
                case "p": print_data();break;
                case "w": write_data();localStorage.setItem("data",cryptr.encrypt(JSON.stringify(data)));break;
                case "d": delete_data();localStorage.setItem("data",cryptr.encrypt(JSON.stringify(data)));break;
                case "s": search_data();break;
                case "q": input = "q";break;
                default:
            }
        }
    }
    catch(error)
    {
        console.log("wrong password fool")
    }    

}