let LocalStorage = require('node-localstorage').LocalStorage;
const Cryptr = require("cryptr");
const fs = require("fs");
localStorage = new LocalStorage('./save');
let term = require( 'terminal-kit' ).terminal ;


let data = {content: []};

let print_data = (index) =>
{
    console.log("\n");
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
    
    // console.log("\n"+table.table(table_content, config));
    term.table(table_content,{
        hasBorder: true ,
		contentHasMarkup: false ,
		borderChars: 'double' ,
		borderAttr: { color: 'red' } ,
		textAttr: { bgColor: 'default' } ,
		firstCellTextAttr: { bgColor: 'white', color: "black"} ,
		firstRowTextAttr: { bgColor: 'white', color: "black" } ,
		firstColumnTextAttr: { bgColor: 'white', color: "black" } ,
		width: 100 ,
		fit: true
        });
}
   
let write_data = async () =>
{   
    term.clear(); 
    let new_data={};
    term.green("\nPlattform: ");
    new_data.name = await term.inputField().promise;
    if(new_data.name===null)
    {
        new_data.name="NULL";
    }
    term.green("\ndescription: ");
    new_data.descr = await term.inputField().promise;
    term.blue("\nusername: ");
    new_data.usr = await term.inputField().promise;
    term.red("\npassword: ");
    new_data.pw = await term.inputField().promise;
    data.content.push(new_data);
}

let delete_data = async () =>
{
    term.clear();
    print_data();
    term("which line to delete: ");
    let line = await term.inputField().promise;
    data.content.splice(line,1);
}

let search_data = async () =>
{
    term.clear();
    term.green("search: ");
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
    term("\n press any key to return")
    await term.inputField().promise;
}


let main = async ()=>
{
    if(!fs.existsSync("./save/data"))
    {   try
        {
            term.red("SETUP Password: ");
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
        term.wrap.red("Password: ");
        const key_string =  await term.inputField().promise;
        try
        {
            let cryptr = new Cryptr(key_string);
            data = JSON.parse(cryptr.decrypt(localStorage.getItem("data")));
        
            let input = ""
            term.clear();
            // print_data();

            var items = [ 'search' , 'write' , 'delete'  , 'quit'] ;

            var options = {
                y: 9999 ,	// the menu will be on the top of the terminal
                style: term.inverse ,
                selectedStyle: term.bold.white.bgRed
            } ;
            while (input!="q")
            {   
                term.clear();             
                print_data();
                input =  await term.singleLineMenu(items, options).promise;
                
                switch(input.selectedText)
                {
                    case "print": print_data();break;
                    case "write": await write_data();localStorage.setItem("data",cryptr.encrypt(JSON.stringify(data)));break;
                    case "delete": await delete_data();localStorage.setItem("data",cryptr.encrypt(JSON.stringify(data)));break;
                    case "search": await search_data();break;
                    case "quit": input = "q";break;
                    default:break;
                }
            }
            term.clear();
            process.exit();
        }
        catch(error)
        {
            term.red("\nwrong password!");
            process.exit();
        }    
    }
}

main();