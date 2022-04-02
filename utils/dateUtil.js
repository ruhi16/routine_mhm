

const curr_date = new Date();   
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const today = days[curr_date.getDay()];

const curr_date_split = curr_date.toISOString().split('T')[0];    
curr_date_split_dt = new Date(curr_date_split);

// console.log(curr_date_split_dt);



