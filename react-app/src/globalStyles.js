// GRAFULATOR
// Last Modified: May 17, 2022
// Authored and Developed by: Kyle Bessemer
// LinkedIn: https://www.linkedin.com/in/kyle-bessemer-606a7a1b2/
// GitHub: https://github.com/kbessemer

import { createGlobalStyle} from "styled-components"

export const GlobalStyles = createGlobalStyle`
  html, .login-screen, .App, .App-Header, body {
    background: ${({ theme }) => theme.AppHeader.background};
    color: ${({ theme }) => theme.body.text};
	padding-top: 0px;
	margin-top: 0px;
	margin-left: 0px;
	margin-right: 0px;
	margin: auto;
  }
  .login-screen {
    display:flex;
    justify-content: center;
    margin: auto;
  }
  .App-header {
    font-size: 18px;
  }
  body {
    font-family: sans-serif;
    transition: all 0.50s linear;
  }
  h3 {
	  color: ${({ theme }) => theme.h3.color};
  }
  .Logo-Light {
	  color: #282c34;
  }
  .dashboard {
	display:flex;
	justify-content: center;
    margin: auto;
	width: 1000px;
  }
  .about {
	justify-content: center;
    margin: auto;
	width: 1000px;
	margin-top: 50px;
  }
  .Login-Box {
	border-radius: 7px;
	background: ${({ theme }) => theme.contentBox.background};
	width: 100%;
	padding: 10px;
	margin-left: 6px;
	margin: auto;
	box-shadow: ${({ theme }) => theme.contentBox.shadow};
	vertical-align: top;
  }
  .Content-Row {
	width: 100%;
	padding-top: 5px;
	display: flex;
	align-items: center;
	margin-top: 10px;
	margin-bottom: 15px;
	align-items: flex-start;
  }
  .Content-Box-Password {
	border-radius: 7px;
	background: ${({ theme }) => theme.contentBox.background};
	width: 30%;
	padding: 10px;
	margin-left: 6px;
	margin: auto;
	box-shadow: ${({ theme }) => theme.contentBox.shadow};
	vertical-align: top;
	display: inline-block;
	position: absolute;
	right: 100px;
	top: 100px;
  }
  .Content-Box-Password-Uploaded {
	border-radius: 7px;
	background: ${({ theme }) => theme.contentBox.background};
	width: 30%;
	padding: 10px;
	margin-left: 6px;
	margin: auto;
	box-shadow: ${({ theme }) => theme.contentBox.shadow};
	vertical-align: top;
	display: inline-block;
	position: absolute;
	right: 100px;
	top: 1000px;
  }
  .Content-Box-Right {
	border-radius: 7px;
	background: ${({ theme }) => theme.contentBox.background};
	width: 30%;
	padding: 10px;
	margin-left: 6px;
	margin: auto;
	box-shadow: ${({ theme }) => theme.contentBox.shadow};
	vertical-align: top;
	display: inline-block;
	position: absolute;
	right: 100px;
	top: 575px;
  }
  .Content-Box-Right-Uploaded {
	border-radius: 7px;
	background: ${({ theme }) => theme.contentBox.background};
	width: 30%;
	padding: 10px;
	margin-left: 6px;
	margin: auto;
	box-shadow: ${({ theme }) => theme.contentBox.shadow};
	vertical-align: top;
	display: inline-block;
	position: absolute;
	right: 100px;
	top: 1475px;
  }
  .Content-Box-Left {
	border-radius: 7px;
	background: ${({ theme }) => theme.contentBox.background};
	width: 50%;
	padding: 10px;
	margin-right: 6px;
	margin: auto;
	box-shadow: ${({ theme }) => theme.contentBox.shadow};
	vertical-align: top;
	display: inline-block;
	position: absolute;
	left: 100px;
	top: 100px;
  }
  .Content-Box-Left-Uploaded {
	border-radius: 7px;
	background: ${({ theme }) => theme.contentBox.background};
	width: 50%;
	padding: 10px;
	margin-right: 6px;
	margin: auto;
	box-shadow: ${({ theme }) => theme.contentBox.shadow};
	vertical-align: top;
	display: inline-block;
	position: absolute;
	left: 100px;
	top: 1000px;
  }
  .Content-Header {
	  display: flex;
  }
  .Header-Icon {
	  padding: 5px;
  }
  .Graph-List {
	width: 80%;
	padding: 10px;
	margin: auto;
  }
  a {
    color: ${({ theme }) => theme.a.color};
  }
  a:hover {
    color: ${({ theme }) => theme.ahover.color};
  }
  tr:hover {
	  background: ${({ theme }) => theme.tr.background};
  }
  .stat-tr:hover{
	  background: #04597c;
  }
  .Add-User-Button {
	  text-align: center;
  }
  .logo {
    position: relative;
    margin-left: 40px;
	width: 500px;
	height: 100px;
	
  }
  .stats-modals {
	  color: #D2E2FF;
	  padding: 16px;
  }
  .formStyle7 {
    padding: 20px;
    color: ${({ theme }) => theme.formStyle7.color};
    font-family: sans-serif,
    border-radius: 2px;
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
	  background: ${({ theme }) => theme.contentBox.background};
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
	  background: ${({ theme }) => theme.contentBox.background};
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
    background: ${({ theme }) => theme.contentBox.background};
    padding: 20px;
    color: ${({ theme }) => theme.formStyle8.color};
    font-family: sans-serif,
    border-radius: 2px;
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
	  border: ${({ theme }) => theme.contentBox.border};
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
	  background: ${({ theme }) => theme.contentBox.background};
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
	  background: ${({ theme }) => theme.contentBox.background};
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
	  background: ${({ theme }) => theme.formStyle8inputsubmithover.background};
	  color: ${({ theme }) => theme.formStyle8inputsubmithover.color};
  }
  #dropZone {
	  background: ${({ theme }) => theme.dropZoneid.background};
	  border: ${({ theme }) => theme.dropZoneid.border};
	  width:  650px;
	  height: 200px;
	  margin: auto;
	  border-radius: 7px;
  }
  .dropZone {
	  color: ${({ theme }) => theme.dropZoneclass.color};
	font-size: 18px;
    text-align: center;
  }
  .icon {
	  filter: ${({ theme }) => theme.icon.filter};
	  padding: 5px;
  }
  th, td {
	padding: 15px;
  }

/* User Buttons */
.add-user {
	background: #2e363f;
	border: none;
	padding: 10px 20px 10px 20px;
	border-bottom: 3px solid #5994FF;
	border-radius: 3px;
	color: #D2E2FF;
	margin-right: 16px;
}
.add-user:hover {
	background: #3059a2;
	color:#fff;
}

.graph-area {
	background: #C0C0C0;
	border: 2px solid #1d1f23;
	width:  800px;
	height: 400px;
  }

  /* Custom Form - Style 7 */
.form-style-7{
	background: #1d1f23;
	  max-width:400px;
	  margin:50px auto;
	  border-radius:2px;
	  padding:20px;
	  font-family: sans-serif;
  }
  .form-style-7 h1{
	  display: block;
	  text-align: center;
	  padding: 0;
	  margin: 0px 0px 20px 0px;
	  color: #5C5C5C;
	  font-size:x-large;
  }
  .form-style-7 ul{
	  list-style:none;
	  padding:0;
	  margin:0;	
  }
  .form-style-7 li{
	  display: block;
	  padding: 9px;
	  border:1px solid #2e363f;
	  margin-bottom: 30px;
	  border-radius: 3px;
  }
  .form-style-7 li:last-child{
	  border:none;
	  margin-bottom: 0px;
	  text-align: center;
  }
  .form-style-7 li > label{
	  display: block;
	  float: left;
	  margin-top: -19px;
	  background: #1d1f23;
	  height: 20px;
	  padding: 2px 5px 2px 5px;
	  color: #5994FF;
	  font-size: 14px;
	  overflow: hidden;
	  font-family: Arial, Helvetica, sans-serif;
  }
  .form-style-7 input[type="text"],
  .form-style-7 input[type="date"],
  .form-style-7 input[type="datetime"],
  .form-style-7 input[type="email"],
  .form-style-7 input[type="number"],
  .form-style-7 input[type="search"],
  .form-style-7 input[type="time"],
  .form-style-7 input[type="url"],
  .form-style-7 input[type="password"],
  .form-style-7 textarea,
  .form-style-7 select 
  {
	background: #1d1f23;
	color: #B9B9B9;
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
  .form-style-7 input[type="text"]:focus,
  .form-style-7 input[type="date"]:focus,
  .form-style-7 input[type="datetime"]:focus,
  .form-style-7 input[type="email"]:focus,
  .form-style-7 input[type="number"]:focus,
  .form-style-7 input[type="search"]:focus,
  .form-style-7 input[type="time"]:focus,
  .form-style-7 input[type="url"]:focus,
  .form-style-7 input[type="password"]:focus,
  .form-style-7 textarea:focus,
  .form-style-7 select:focus 
  {
  }
  .form-style-7 li > span{
	  background: #2e363f;
	  display: block;
	  padding: 3px;
	  margin: 0 -9px -9px -9px;
	  text-align: center;
	  color: #C0C0C0;
	  font-family: Arial, Helvetica, sans-serif;
	  font-size: 11px;
  }
  .form-style-7 textarea{
	  resize:none;
  }
  .form-style-7 input[type="submit"],
  .form-style-7 input[type="button"],
  .form-style-7 input[type=file]::file-selector-button{
	  background: #2e363f;
	  border: none;
	  padding: 10px 20px 10px 20px;
	  border-bottom: 3px solid #5994FF;
	  border-radius: 3px;
	  color: #D2E2FF;
  }
  .form-style-7 input[type="submit"]:hover,
  .form-style-7 input[type="button"]:hover,
  .form-style-7 input[type=file]::file-selector-button:hover{
	  background: #3059a2;
	  color:#fff;
  }
  
  /* Custom Form - Style 8 */
  .form-style-8{
	  background: #282c33;
		max-width:400px;
		margin:50px auto;
		border-radius:2px;
		padding:20px;
		font-family: sans-serif;
	}
	.form-style-8 h1{
		display: block;
		text-align: center;
		padding: 0;
		margin: 0px 0px 20px 0px;
		color: #5C5C5C;
		font-size:x-large;
	}
	.form-style-8 ul{
		list-style:none;
		padding:0;
		margin:0;	
	}
	.form-style-8 li{
		display: block;
		padding: 9px;
		border:1px solid #1d1f22;
		margin-bottom: 30px;
		border-radius: 3px;
	}
	.form-style-8 li:last-child{
		border:none;
		margin-bottom: 0px;
		text-align: center;
	}
	.form-style-8 li > label{
		display: block;
		float: left;
		margin-top: -19px;
		background: #282d33;
		height: 20px;
		padding: 2px 5px 2px 5px;
		color: #B9B9B9;
		font-size: 14px;
		overflow: hidden;
		font-family: Arial, Helvetica, sans-serif;
	}
	.form-style-8 input[type="text"],
	.form-style-8 input[type="date"],
	.form-style-8 input[type="datetime"],
	.form-style-8 input[type="email"],
	.form-style-8 input[type="number"],
	.form-style-8 input[type="search"],
	.form-style-8 input[type="time"],
	.form-style-8 input[type="url"],
	.form-style-8 input[type="password"],
	.form-style-8 textarea,
	.form-style-8 select 
	{
	  background: #292b34;
	  color: #B9B9B9;
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
	.form-style-8 input[type="text"]:focus,
	.form-style-8 input[type="date"]:focus,
	.form-style-8 input[type="datetime"]:focus,
	.form-style-8 input[type="email"]:focus,
	.form-style-8 input[type="number"]:focus,
	.form-style-8 input[type="search"]:focus,
	.form-style-8 input[type="time"]:focus,
	.form-style-8 input[type="url"]:focus,
	.form-style-8 input[type="password"]:focus,
	.form-style-8 textarea:focus,
	.form-style-8 select:focus 
	{
	}
	.form-style-8 li > span{
		background: #1d1f22;
		display: block;
		padding: 3px;
		margin: 0 -9px -9px -9px;
		text-align: center;
		color: #C0C0C0;
		font-family: Arial, Helvetica, sans-serif;
		font-size: 11px;
	}
	.form-style-8 textarea{
		resize:none;
	}
	.form-style-8 input[type="submit"],
	.form-style-8 input[type="button"],
	.form-style-8 input[type=file]::file-selector-button{
		background: #2e363f;
		border: none;
		padding: 10px 20px 10px 20px;
		border-bottom: 3px solid #5994FF;
		border-radius: 3px;
		color: #D2E2FF;
	}
	.form-style-8 input[type="submit"]:hover,
	.form-style-8 input[type="button"]:hover,
	.form-style-8 input[type=file]::file-selector-button:hover{
		background: #3059a2;
		color:#fff;
	}
	.moon {
		filter: contrast(0%);
	}
	.left-margin {
		margin-left: 40px;
	}
	/* Dropdown Button */
	.dropbtn {
	background-color: ${({ theme }) => theme.dropZoneid.background};
	color: #fff;
	border: none;
	cursor: pointer;
	margin-right: 16px;
	border: none;
	padding: 10px 20px 10px 20px;
	border-bottom: 3px solid #5994FF;
	border-radius: 3px;
	}

	/* Dropdown button on hover & focus */
	.dropbtn:hover, .dropbtn:focus {
	background-color: #5994FF;
	}

	/* The search field */
	#rangeStartInput, #rangeStopInput, #statInput, #formulaInput {
	box-sizing: border-box;
	background-image: url('searchicon.png');
	background-position: 14px 12px;
	background-repeat: no-repeat;
	font-size: 16px;
	padding: 14px 20px 12px 45px;
	border: none;
	border-bottom: 1px solid #ddd;
	}

	/* The search field when it gets focus/clicked on */
	#rangeStartInput:focus, #rangeStopInput:focus, #statInput:focus, #formulaInput:focus {outline: 3px solid #ddd;}

	/* The container <div> - needed to position the dropdown content */
	.dropdown {
	position: relative;
	display: inline-block;
	}

	/* Dropdown Content (Hidden by Default) */
	.dropdown-content {
	display: none;
	position: absolute;
	background-color: #f6f6f6;
	min-width: 230px;
	border: 1px solid #ddd;
	z-index: 1;
	}

	/* Links inside the dropdown */
	.dropdown-content a {
	color: black;
	padding: 12px 16px;
	text-decoration: none;
	display: block;
	}

	/* Change color of dropdown links on hover */
	.dropdown-content a:hover {background-color: #f1f1f1}

	/* Show the dropdown menu (use JS to add this class to the .dropdown-content container when the user clicks on the dropdown button) */
	.show {display:block;}
	.statZone {
	  background: #7d8697;
	  border: 1px solid #2e363f;
	  width:  650px;
	  margin-top: 16px;
	  border-radius: 3px;
	  padding: 10px;
  }
  `