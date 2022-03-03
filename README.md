# Vito-test

## About
API allows the user to request only the required data.

## Getting started
Before starting work, you need to create a database and fill it with documents. Open the file *`createDB.ts`* and run the script.
The script is launched through the Developer PowerShell or command line:
```c#
npm run create
```
When the database is created, a corresponding message will appear on the command line.
After that you may start the server script by the command:
```c#
npm run start
```
The command line will display the message: *Running a GraphQL API server at localhost:3000*.
Then you need to go to *http://localhost:3000/graphql* and enjoy!

## How to use
For convenience, you can use the queries from the examples section. Also, you can change the composition of the data output fields.
*`id`*, *`num`*, *`name`*, *`fullName`* and *`brand`* fields accept string values. For *`first`* and *`offset`* use the Int.

## Input data format
The format of ID for users always is *"user-XXX"*, where XXX is the user number. Similarly for phones ID.
Name is a string without extra characters like spaces. Same as brand.
Write the *`fullName`* separated by a space, for example *"James Bond"*, because I slice the string by a space.
Phone number have the format *"+This-is-YYY-ZZZZZ's-phone-number-0"*, where YYY is the user first name and ZZZZZ is the user last name.
This implementation is not able to recognize invalid user input, so you need to follow the format specified in the examples section.

## GraphQL query examples
Gets an any document from CouchDB document by ID:
```css
{
  userByID(id: "user-007") {
    first_name
    last_name
    phone_model {
      brand
      model
    }
  }
}

{
  phoneByID(id: "phone-003") {
    brand
    model
    users {
      first_name
      last_name
    }
  }
}
```
Gets the user data from DB by phone number:
```css
{
  userByPhoneNum(num: "+This-is-Tom-Holland's-phone-number-0") {
    first_name
    last_name
    phone_model {
      brand
      model
    }
  }
}
```
Also, you can get some users by user first name:
```css
{
  userByName(name: "John") {
    first_name
    last_name
    phone_model {
      brand
      model
    }
  }
}
```
Or do you need a specific user? Gets all info about interesting user by user fullName:
```css
{
  userByFullName(fullName: "John Doe") {
    first_name
    last_name
    phone_model {
      brand
      model
    }
  }
}
```
You can list all phone brands and check who is using this brand:
```css
{
  phoneByBrand(brand: "Apple") {
    model
    users {
      first_name
      last_name
    }
  }
}
```
And finally, you can get the list of all the docs of each element from the database. For a user list I recommend using a start offset of 16, otherwise you might get an empty list. I haven't figured out how to fix this yet.
```css
{
  users(first: 3, offset: 16) {
    first_name
    last_name
    phone_model {
      brand
      model
    }
  }
}

{
  phones(first: 3, offset: 0) {
    brand
    model
    users {
      first_name
      last_name
    }
  }
}
```
All fields can be customized to suit your needs. 
I was happy to work on it.
Have a good day!