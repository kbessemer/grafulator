import { createGlobalStyle} from "styled-components"

export const GlobalStyles = createGlobalStyle`
  html, .login-screen, .App, .App-Header, body {
    background: ${({ theme }) => theme.AppHeader.background};
    color: ${({ theme }) => theme.body.text};
  }
  .login-screen {
    display:flex;
    justify-content: center;
    margin: auto;
  }
  .App-header {
    align-items: left;
    justify-content: left;
    font-size: 18px;
    margin-left: 250px;
  }
  body {
    font-family: sans-serif;
    transition: all 0.50s linear;
  }
  a {
    color: ${({ theme }) => theme.a.color};
  }
  a:hover {
    color: ${({ theme }) => theme.ahover.color};
  }
  .logo {
    position: relative;
    margin-left: 100px;
    margin-top: 0;
  }
  .theme {
    position: absolute;
  }
  .formStyle7 {
    background: ${({ theme }) => theme.formStyle7.background};
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
	  background: ${({ theme }) => theme.formStyle8inputsubmithover.background};
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
    text-align: center;
  }
  .icon {
	  filter: ${({ theme }) => theme.icon.filter};
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
  `