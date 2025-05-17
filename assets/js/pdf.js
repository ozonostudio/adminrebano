// Function to convert local image URL to Base64
async function convertImageToBase64(imageUrl) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous'; // Required for CORS-enabled servers
        img.onload = function () {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = this.width;
            canvas.height = this.height;
            ctx.drawImage(this, 0, 0);
            const base64 = canvas.toDataURL();
            resolve(base64);
        };
        img.onerror = function () {
            reject(new Error('Failed to load image'));
        };
        img.src = imageUrl;
    });
}
function formatDate(dateString) {
    // Split the date string into an array
    const parts = dateString.split('-');
    
    // Rearrange the parts to form the desired format
    const formattedDate = `${parts[1]}/${parts[2]}/${parts[0]}`;
    
    return formattedDate;
}
async function printTeam(t) {
    teamsData.forEach(async team => {
        if (team.id == t) {
            var teamName = team.name;

            // Create a new jsPDF instance
            const doc = new jspdf.jsPDF({unit: 'px', format: 'a4', dpi: 150});

            // Create header
            const header = await convertImageToBase64(`${url}/assets/media/header_reg.png`);
            doc.addImage(header, 'PNG', 10, 10, 426, 67);

            var teamPic;
            if(team.pic){ teamPic = team.pic; }else{ teamPic = `assets/media/nologo.png`; }

            var file = getFileDetails(teamPic);
            const logo = await convertImageToBase64(`${url}/${teamPic}`);
            doc.addImage(logo, `${file.extension}`, 30, 90, 100, 100);

            // Team data
            doc.setFontSize(24); // default size is 12
            doc.setFont('helvetica', 'bold'); // set font and style
            doc.text(160, 140, teamName, { maxWidth: 266, lineHeightFactor: 1, });
            doc.setFontSize(10);
            doc.text(160, 120, `UUID: ${team.uuid}`);

            // Reset font to default
            doc.setFont('times', 'normal'); // set font to default and normal style
            doc.setFontSize(12);

            // Create table header
            const tableHeader = [lang.playername, lang.birthday, lang.playerpic];
            let tableRows = [tableHeader];
            var images = [];
            const rowHeight = 40;
            var playerPic;

            // Iterate over each user data and add to the table
            for (const teamPlayer of team.players) {
                for (const player of playersData) {
                    if (teamPlayer.player === player.id) {
                        if(player.pic){
                            playerPic = `${url}/${player.pic}`;
                        }else{
                            playerPic = `${url}/assets/media/nopic.png`;
                        }
                        const base64Image = await convertImageToBase64(playerPic);
                        tableRows.push([player.name, player.birth]);
                        images.push({ image: base64Image, width: rowHeight, height: rowHeight })
                    }
                }
            }

            // Add table to the PDF
            doc.autoTable({
                startY: 210, // start position for the table
                head: [tableHeader],
                headStyles: {
                    fillColor: [191, 191, 191],
                    textColor: [0, 0, 0],
                },
                bodyStyles: {minCellHeight: rowHeight},
                body: tableRows.slice(1), // remove header from body
                theme: 'striped', // 'striped', 'grid', 'plain', 'grid' or 'striped'
                margin: { top: 15 },
                didDrawCell: function (data) {
                    if (data.column.index === 2 && data.cell.section === 'body') {
                        const image = images[data.row.index];
                        if (image) {
                            const textPos = data.cell.textPos || { x: data.cell.x, y: data.cell.y }; // Fallback to cell position if textPos is undefined
                            const xOffset = textPos.x + (data.cell.width - image.width) / 2; // Calculate x offset to center the image
                            const yOffset = textPos.y;
                            doc.addImage(image.image, xOffset, yOffset, image.width, image.height);
                        }
                    }
                }                
            });


            // Save the PDF
            doc.save(`${teamName.replace(/\s/g, "_")}-${team.uuid}`);
        }
    });
};

async function printPlayers(t) {
    teamsData.forEach(async team => {
        if (team.id == t) {
            var teamName = team.name;
            const w = 115;
            const h = 183;
            var x;
            var y;
            const chunkSize = 10;
            const subgroupSize = 5;

            const list = [];

            for (const teamPlayer of team.players) {
                for (const player of playersData) {
                    if (teamPlayer.player === player.id) {
                        if(player.pic){
                            playerPic = `${url}/${player.pic}`;
                        }else{
                            playerPic = `${url}/assets/media/nopic.png`;
                        }
                        const base64Image = await convertImageToBase64(playerPic);

                        list.push({name: player.name, birth: player.birth, image:  base64Image});
                    }
                }
            }

            const numPages = Math.ceil(list.length / chunkSize);

            const doc = new jspdf.jsPDF({unit: 'px', format: 'a4', dpi: 150, orientation: 'landscape'});
            const bg = await convertImageToBase64(`${url}/assets/media/id.png`);

            for (let page = 0; page <= numPages; page++) {
                if(page > 0 && page < numPages){
                    doc.addPage();
                }
                for (let i = page * chunkSize; i < (page + 1) * chunkSize && i < list.length; i++) {
                    const player = list[i];
                    const rowIndex = Math.floor((i % chunkSize) / subgroupSize); // Calculate the row index
                    const colIndex = i % subgroupSize; // Calculate the column index

                    switch (colIndex) {
                        case 1:
                            x = 144;
                            break;
                        case 2:
                            x = 259;
                            break;
                        case 3:
                            x = 374;
                            break;
                        case 4:
                            x = 489;
                            break;
                        default:
                            x = 29;
                    }
                    switch (rowIndex) {
                        case 1:
                            y = 223;
                            break;
                        default:
                            y = 40;
                    }
                    doc.addImage(player.image, (x + 59), (y + 30), 52, 54);
                    doc.addImage(bg, x, y, w, h);

                    // Set font size and style
                    doc.setFontSize(10);
                    doc.setTextColor("#000000");
                    doc.setFont('helvetica', 'bold');

                    // Text to be centered
                    const text = player.name;
                    const maxWidth = 80;

                    // Add text to the PDF at the calculated position
                    doc.text(text, (x + 9), (y + 100), {maxWidth});
                    doc.text(teamName, (x + 9), (y + 136), {maxWidth});
                    doc.text(formatDate(player.birth), (x + 9), (y + 160), {maxWidth});

                }
            }
            // Save the PDF
            doc.save(`${teamName.replace(/\s/g, "_")}-idcards`);
        }
    });
};



function combineDataArrays() {
    const allData = [];

    allData.push(...tourData);
    allData.push(...teamsData);
    allData.push(...playersData);

    return allData;
}

// Main function to compare and remove unused files
function compareAndRemoveUnusedFiles() {
    const allData = combineDataArrays();
    const docFiles = listFiles('docs_directory');
    const uploadFiles = listFiles('uploads_directory');

    const allFilePaths = allData.reduce((acc, data) => {
        // Assuming your data objects have a property containing file paths
        return acc.concat(Object.values(data)); // Adjust this according to your data structure
    }, []);

    const allUsedFiles = [...new Set(allFilePaths)];
    const unusedDocFiles = docFiles.filter(file => !allUsedFiles.includes(file));
    const unusedUploadFiles = uploadFiles.filter(file => !allUsedFiles.includes(file));

    // Code to remove unused files
    unusedDocFiles.forEach(file => fs.unlinkSync(file));
    unusedUploadFiles.forEach(file => fs.unlinkSync(file));

    console.log('Unused files removed:', unusedDocFiles, unusedUploadFiles);
}
