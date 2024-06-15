export const TruncateString = (str) => {
    if(str.length < 300)
     {
       return str;
     }
     return str.slice(0,50) + "..."
 }