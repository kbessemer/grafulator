import { createGlobalStyle} from "styled-components"

export const GlobalStyles = createGlobalStyle`
  body {
    background: ${({ theme }) => theme.body.body};
    color: ${({ theme }) => theme.body.text};
    font-family: sans-serif;
    transition: all 0.50s linear;
  }
  .formStyle7 {
    background: ${({ theme }) => theme.formStyle7.background};
    margin: 50px auto;
    padding: 20px;
    color: ${({ theme }) => theme.formStyle7.color};
    font-family: sans-serif,
    border-radius:2px;
    max-width:400px;
  }
  .formStyle7 ul{
	list-style:none;
	padding:0;
	margin:0;	
  }
  .formStyle7 li{
	  display: block;
	  padding: 9px;
	  border: ${({ theme }) => theme.formStyle7li.border};
	  margin-bottom: 30px;
	  border-radius: 3px;
  }
  .formStyle7 li:last-child{
	  border:none;
	  margin-bottom: 0px;
	  text-align: center;
  }
  .formStyle7 li > label{
	  display: block;
	  float: left;
	  margin-top: -19px;
	  background: ${({ theme }) => theme.formStyle7lilabel.background};
	  height: 20px;
	  padding: 2px 5px 2px 5px;
	  color: ${({ theme }) => theme.formStyle7lilabel.color};
	  font-size: 14px;
	  overflow: hidden;
	  font-family: sans-serif;
  }
  .formStyle7 input[type="text"],
  .formStyle7 input[type="date"],
  .formStyle7 input[type="datetime"],
  .formStyle7 input[type="email"],
  .formStyle7 input[type="number"],
  .formStyle7 input[type="search"],
  .formStyle7 input[type="time"],
  .formStyle7 input[type="url"],
  .formStyle7 input[type="password"],
  .formStyle7 textarea,
  .formStyle7 select 
  {
	  background: ${({ theme }) => theme.formStyle7input.background};
	  color: ${({ theme }) => theme.formStyle7input.color};
	  box-sizing: border-box;
	  -webkit-box-sizing: border-box;
	  -moz-box-sizing: border-box;
	  width: 100%;
	  display: block;
	  outline: none;
	  border: none;
	  height: 25px;
	  line-height: 25px;
	  font-size: 16px;
	  padding: 0;
	  font-family: sans-serif;
  }
  .formStyle7 input[type="text"]:focus,
  .formStyle7 input[type="date"]:focus,
  .formStyle7 input[type="datetime"]:focus,
  .formStyle7 input[type="email"]:focus,
  .formStyle7 input[type="number"]:focus,
  .formStyle7 input[type="search"]:focus,
  .formStyle7 input[type="time"]:focus,
  .formStyle7 input[type="url"]:focus,
  .formStyle7 input[type="password"]:focus,
  .formStyle7 textarea:focus,
  .formStyle7 select:focus 
  {
  }
  .formStyle7 li > span{
	  background: ${({ theme }) => theme.formStyle7inputhover.background};
	  display: block;
	  padding: 3px;
	  margin: 0 -9px -9px -9px;
	  text-align: center;
	  color: ${({ theme }) => theme.formStyle7inputhover.color};
	  font-family: Arial, Helvetica, sans-serif;
	  font-size: 11px;
  }
  .formStyle7 textarea{
	  resize:none;
  }
  .formStyle7 input[type="submit"],
  .formStyle7 input[type="button"],
  .formStyle7 input[type=file]::file-selector-button{
	  background: ${({ theme }) => theme.formStyle7inputsubmit.background};
	  border: none;
	  padding: 10px 20px 10px 20px;
	  border-bottom: ${({ theme }) => theme.formStyle7inputsubmit.borderBottom};
	  border-radius: 3px;
	  color: ${({ theme }) => theme.formStyle7inputsubmit.color};
  }
  .formStyle7 input[type="submit"]:hover,
  .formStyle7 input[type="button"]:hover,
  .formStyle7 input[type=file]::file-selector-button:hover{
	  background: ${({ theme }) => theme.formStyle7inputsubmithover.background};
	  color: ${({ theme }) => theme.formStyle7inputsubmithover.color};
  }
  .formStyle8 {
    background: ${({ theme }) => theme.formStyle8.background};
    margin: 50px auto;
    padding: 20px;
    color: ${({ theme }) => theme.formStyle8.color};
    font-family: sans-serif,
    border-radius:2px;
    max-width:400px;
  }
  .formStyle8 ul{
	list-style:none;
	padding:0;
	margin:0;	
  }
  .formStyle8 li{
	  display: block;
	  padding: 9px;
	  border:1px solid #1d1f22;
	  margin-bottom: 30px;
	  border-radius: 3px;
  }
  .formStyle8 li:last-child{
	  border:none;
	  margin-bottom: 0px;
	  text-align: center;
  }
  .formStyle8 li > label{
	  display: block;
	  float: left;
	  margin-top: -19px;
	  background: ${({ theme }) => theme.formStyle8lilabel.background};
	  height: 20px;
	  padding: 2px 5px 2px 5px;
	  color: ${({ theme }) => theme.formStyle8lilabel.color};
	  font-size: 14px;
	  overflow: hidden;
	  font-family: sans-serif;
  }
  .formStyle8 input[type="text"],
  .formStyle8 input[type="date"],
  .formStyle8 input[type="datetime"],
  .formStyle8 input[type="email"],
  .formStyle8 input[type="number"],
  .formStyle8 input[type="search"],
  .formStyle8 input[type="time"],
  .formStyle8 input[type="url"],
  .formStyle8 input[type="password"],
  .formStyle8 textarea,
  .formStyle8 select 
  {
	  background: ${({ theme }) => theme.formStyle8input.background};
	  color: ${({ theme }) => theme.formStyle8input.color};
	  box-sizing: border-box;
	  -webkit-box-sizing: border-box;
	  -moz-box-sizing: border-box;
	  width: 100%;
	  display: block;
	  outline: none;
	  border: none;
	  height: 25px;
	  line-height: 25px;
	  font-size: 16px;
	  padding: 0;
	  font-family: sans-serif;
  }
  .formStyle8 input[type="text"]:focus,
  .formStyle8 input[type="date"]:focus,
  .formStyle8 input[type="datetime"]:focus,
  .formStyle8 input[type="email"]:focus,
  .formStyle8 input[type="number"]:focus,
  .formStyle8 input[type="search"]:focus,
  .formStyle8 input[type="time"]:focus,
  .formStyle8 input[type="url"]:focus,
  .formStyle8 input[type="password"]:focus,
  .formStyle8 textarea:focus,
  .formStyle8 select:focus 
  {
  }
  .formStyle8 li > span{
	  background: ${({ theme }) => theme.formStyle8inputhover.background};
	  display: block;
	  padding: 3px;
	  margin: 0 -9px -9px -9px;
	  text-align: center;
	  color: ${({ theme }) => theme.formStyle8inputhover.color};
	  font-family: Arial, Helvetica, sans-serif;
	  font-size: 11px;
  }
  .formStyle8 textarea{
	  resize:none;
  }
  .formStyle8 input[type="submit"],
  .formStyle8 input[type="button"],
  .formStyle8 input[type=file]::file-selector-button{
	  background: ${({ theme }) => theme.formStyle8inputsubmit.background};
	  border: none;
	  padding: 10px 20px 10px 20px;
	  border-bottom: ${({ theme }) => theme.formStyle8inputsubmit.borderBottom};
	  border-radius: 3px;
	  color: ${({ theme }) => theme.formStyle8inputsubmit.color};
  }
  .formStyle8 input[type="submit"]:hover,
  .formStyle8 input[type="button"]:hover,
  .formStyle8 input[type=file]::file-selector-button:hover{
	  background: ${({ theme }) => theme.formStyle8inputsubmithover.color};
	  color: ${({ theme }) => theme.formStyle8inputsubmithover.color};
  }
  #dropZone {
	background: ${({ theme }) => theme.dropZoneid.background};
	border: ${({ theme }) => theme.dropZoneid.border};
	width:  600px;
	height: 200px;
  }
  .dropZone {
	color: ${({ theme }) => theme.dropZoneclass.color};
	font-size: 18px;
  }
  `