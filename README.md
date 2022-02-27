# Vito-test

## About
API allows the user to request only the required data.

## Getting started
The script is launched through the Developer PowerShell or command line:
```c#
npm start
```
The command line will display the message: *Running a GraphQL API server at localhost:3000*.
Then you need to go to *http://localhost:3000/graphql*

## How to use
Use the queries from the examples section. You can change the composition of the data output fields.
*`id`*, *`phone`*, *`name`*, *`fullName`* and *`stringKey`* fields accept string values.
The function *`findByStringKey()`* finds data by the first word in the string.
Important to write the *`fullName`* separated by a space.
This implementation is not able to recognize invalid user input, so you need to follow the format specified in the examples section.

## GraphQL query examples
Gets a document from CouchDB whose _id is docname:
```css
{
  friendByID (id: "81b335fe33591a6a52da654478007253") {
    _id
    user_id
    first_name
    last_name
    phone_number
  }
}
```
List all the docs of each element in the database:
```css
{
  friends {
    _id
    user_id
    first_name
    last_name
    phone_number
  }
}
```
Gets a user data from DB by phone number:
```css
{
  friendByPhone (phone: "+This-is-Jane-Doe's-phone-number-5") {
    _id
    user_id
    first_name
    last_name
    phone_number
  }
}
```
Gets a user data from DB by user first name:
```css
{
  friendByName (name: "Tom") {
    _id
    user_id
    first_name
    last_name
    phone_number
  }
}
```
Gets a user data from DB by user full name:
```css
{
  friendByFullName (fullName: "Tom Holland") {
    _id
    user_id
    first_name
    last_name
    phone_number
  }
}
```
Search elements by arbitrary string key:
```css
{
  findByStringKey (stringKey: "002") {
    _id
    user_id
    first_name
    last_name
    phone_number
  }
}
```
All fields can be customized to suit your needs.