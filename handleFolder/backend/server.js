const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs-extra');

const app = express();
const PORT = 6999;

app.use(cors());
app.use(fileUpload());
app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "5mb" }));


// converting the file size in gb or mb
const convertFileSize = (sizeInBytes) => {
    const kilobyte = 1024;
    const megabyte = kilobyte * 1024;
    const gigabyte = megabyte * 1024;
    if (sizeInBytes >= gigabyte) {
        return (sizeInBytes / gigabyte).toFixed(2) + ' GB';
    } else if (sizeInBytes >= megabyte) {
        return (sizeInBytes / megabyte).toFixed(2) + ' MB';
    } else if (sizeInBytes >= kilobyte) {
        return (sizeInBytes / kilobyte).toFixed(2) + ' KB';
    } else {
        return sizeInBytes + ' bytes';
    }
}

//formate date
const formatDate = (date) => {
    const day = String(new Date(date).getDate()).padStart(2, '0');
    const month = String(new Date(date).getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = new Date(date).getFullYear();

    return `${day}-${month}-${year}`;
}


//Getting the files and folder while uploading the folder
app.get("/fetchDirectoryContensts", (req, res) => {

    const folderPath = req.query.folderPath;

    fs.readdir(folderPath, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading directorey' })
        }

        const directoryContents = [];

        files.forEach(file => {
            const filePath = path.join(folderPath, file);
            try {

                const stats = fs.statSync(filePath);
                let createdDate = formatDate(stats.birthtime);
                let modifiedDate = formatDate(stats.mtime);
                let fileSize = stats.size;
                console.log(fileSize)

                let repLacedpath = filePath.replaceAll('\\', '/');

                const item = {
                    name: file,
                    createDate: createdDate,
                    modifieDate: modifiedDate,
                    extension: path.extname(filePath),
                    isDirectory: stats.isDirectory(),
                    size: stats.isDirectory() ? " " : convertFileSize(stats.size),
                    fileUrl: repLacedpath
                };


                directoryContents.push(item);

            } catch (error) {
                console.log(error)
            }

        });

        return res.status(200)
            .json({
                success: true,
                message: "Get all the data from folder",
                data: directoryContents
            });
    });
});


//Deleting the file from the folder or Pc after uploading the excel file with the field of filepath
app.delete("/deletefilefolder", async (req, res) => {
    try {
        const filePath = req.query.filePath;

        let extension = path.extname(filePath);

        if (extension) {

            // Check if the file or directory exists and the calling process has access
            fs.access(filePath, (err) => {
                if (err) {
                    console.log("File not found or access denied")
                } else {
                    // If the file or directory exists and access is granted, proceed with deletion
                    fs.unlink(filePath, (err) => {
                        if (err) {
                            console.log(`Error deleting file : ${err}`)
                        }
                    });
                }
            });

        } else {
            fs.remove(filePath);
        }


        return res.status(200)
            .json({
                success: true,
                message: "File/Folder Deleted Successfully"
            })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})