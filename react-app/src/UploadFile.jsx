import React from 'react';

function UploadFile() {

    return (
        <div>
        <form className="form-style-7">
          <ul>
            <li>
                <label htmlFor="file">File Upload</label>
                <input type="file" name="file"/>
                <span>Upload your file here</span>
            </li>
            <li>
                <input type="submit" value="UPLOAD"/>
            </li>
          </ul>
        </form>
        </div>
    )
}

export default UploadFile