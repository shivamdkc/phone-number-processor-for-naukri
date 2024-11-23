document.getElementById('upload').addEventListener('change', handleFile); // Handling the Excel Upload scenario

function handleFile(event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  
  reader.onload = function (e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json(worksheet);

    const processedData = json.map(row => ({
      ...row,
      "Formatted Number": formatPhoneNumber(row["Phone Number"]),
    }));

    const newSheet = XLSX.utils.json_to_sheet(processedData);
    const newWorkbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(newWorkbook, newSheet, "Processed Numbers");

    const outputData = XLSX.write(newWorkbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([outputData], { type: "application/octet-stream" });
    
    const downloadButton = document.getElementById('download');
    downloadButton.style.display = 'block';
    downloadButton.onclick = () => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Processed_Numbers.xlsx';
      a.click();
    };
  };

  reader.readAsArrayBuffer(file);
}

function formatPhoneNumber(number) {
  if (!number) return "Invalid";
  
  // Remove spaces, dashes, or any non-numeric characters
  let cleaned = String(number).replace(/\D/g, '');
  console.log(cleaned)

  // Handle cases based on length and potential prefix
  if (cleaned.length === 10) {
    return `+91${cleaned}`;
  } else if (cleaned.length > 10) {
    cleaned = cleaned.slice(cleaned.length - 10);
    return `+91${cleaned}`;
  } else {
    return "Invalid";
  }
}



