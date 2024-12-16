// Example Data
const rawFiles = [
    'document1.txt', 'presentation1.pdf', 'song1.mp3', 'installer1.exe', 'archive1.rar', 'report1.docx', 'image1.jpg', 'graphic1.png', 'animation1.gif', 'compressed1.zip', 'document2.txt', 'presentation2.pdf', 'song2.mp3', 'installer2.exe', 'archive2.rar', 'report2.docx', 'image2.jpg', 'graphic2.png', 'animation2.gif', 'compressed2.zip', null, 'presentation3.pdf', '', 'installer3.exe', 'archive3.rar', 'report3.docx', 'image3.jpg', 'graphic3.png', 'animation3.gif', 'compressed3.zip', 'document4.txt', 'presentation4.pdf', 'song4.mp3', 'installer4.exe', 'archive4.rar', 'report4.docx', 'image4.jpg', 'graphic4.png', 'animation4.gif', 'compressed4.zip', 'document5.txt', 'presentation5.pdf', 'song5.mp3', 'installer5.exe', 'archive5.rar', 'report5.docx', 'image5.jpg', 'graphic5.png', 'animation5.gif', 'compressed5.zip', 'document6.txt', 'presentation6.pdf', 'song6.mp3', 'installer6.exe', 'archive6.rar', 'report6.docx', 'image6.jpg', null, 'animation6.gif', 'compressed6.zip', 'document7.txt', 'presentation7.pdf', 'song7.mp3', 'installer7.exe', 'archive7.rar', 'report7.docx', 'image7.jpg', 'graphic7.png', 'animation7.gif', 'compressed7.zip', 'document8.txt', 'presentation8.pdf', 'song8.mp3', 'installer8.exe', 'archive8.rar', 'report8.docx', 'image8.jpg', '', 'animation8.gif', 'compressed8.zip', 'document9.txt', 'presentation9.pdf', 'song9.mp3', 'installer9.exe', 'archive9.rar', 'report9.docx', 'image9.jpg', '', 'animation9.gif', 'compressed9.zip', 'document10.txt', 'presentation10.pdf', 'song10.mp3', 'installer10.exe', 'archive10.rar', 'report10.docx', 'image10.jpg', 'graphic10.png', 'animation10.gif', 'compressed10.zip', 
  ];
  
  
  // Clean invalid entries
  const files = rawFiles.filter(file => file && file.trim() !== '');
  
  // File Icons Mapping
  const fileIcons = {
    '.txt': 'https://via.placeholder.com/50?text=TXT',
    '.pdf': 'https://via.placeholder.com/50?text=PDF',
    '.mp3': 'https://via.placeholder.com/50?text=MP3',
    '.exe': 'https://via.placeholder.com/50?text=EXE',
    '.rar': 'https://via.placeholder.com/50?text=RAR',
    '.docx': 'https://via.placeholder.com/50?text=DOCX',
    '.jpg': 'https://via.placeholder.com/50?text=JPG',
    '.png': 'https://via.placeholder.com/50?text=PNG',
    '.gif': 'https://via.placeholder.com/50?text=GIF',
    '.zip': 'https://via.placeholder.com/50?text=ZIP'
  };
  const defaultIcon = 'https://via.placeholder.com/50?text=FILE';
  
  // Global State
  let categorizedFiles = {};
  let bin = [];
  let fileHistory = {};
  let currentCategory = null;
  let currentFiles = [];
  let sortOrder = 'asc';
;
  // DOM Elements
  const folderList = document.getElementById('folderList');
  const fileList = document.getElementById('fileList');
  const binList = document.getElementById('binList');
  const searchInput = document.getElementById('search');
  const sortToggle = document.getElementById('sortToggle');
  const modal = document.getElementById('modal');
  const modalMessage = document.getElementById('modalMessage');
  const confirmAction = document.getElementById('confirmAction');
  const cancelAction = document.getElementById('cancelAction');
  const closeHistory = document.getElementById('closeHistory');
  const clearBinBtn = document.getElementById('clearBin');
  const fileToolbar = document.querySelector('.file-toolbar');

  // Categorize Files
  function categorizeFiles() {
    categorizedFiles = files.reduce((acc, file) => {
      const ext = file.match(/\.\w+$/)?.[0] || '';
      if (!acc[ext]) acc[ext] = [];
      acc[ext].push(file);
      fileHistory[file] = [];
      return acc;
    }, {});
  }
  
  // Render Folders
  function renderFolders() {
    folderList.innerHTML = '';
    Object.keys(categorizedFiles).forEach(ext => {
      const li = document.createElement('li');
      li.textContent = ext.toUpperCase();
      li.onclick = () => loadFiles(ext);
      folderList.appendChild(li);
    });
  }
  
  // Load Files for Folder
  function loadFiles(extension) {
    currentCategory = extension;
    currentFiles = [...categorizedFiles[extension]];

    if (currentFiles.length > 0) {
        fileToolbar.style.display = 'flex'; // Show toolbar
    } else {
        fileToolbar.style.display = 'none'; // Hide toolbar if no files
    }
    renderFiles();
  }
  

// Default Message When No Folder is Selected
function showPlaceholderMessage() {
    fileList.innerHTML = `
      <div class="placeholder-message">
        <i class="fas fa-folder-open"></i>
        <p>Select a folder to view its files</p>
      </div>
    `;
    fileToolbar.style.display = 'none';
  }



 function renderFiles() {
    fileList.innerHTML = ""; // Clear current content

    // Re-sync currentFiles with categorizedFiles
    if (currentCategory) {
        currentFiles = categorizedFiles[currentCategory] || [];
    }

    // Check if there are files to display
    if (!currentCategory || currentFiles.length === 0) {
        showPlaceholderMessage(); // Show placeholder if no files
        return;
    }

    // Loop through currentFiles (already sorted)
    currentFiles.forEach((file) => {
        const ext = file.match(/\.\w+$/)?.[0] || "";
        const li = document.createElement("li");
        li.classList.add("file-card");

        const fileName = file.replace(ext, "");

        li.innerHTML = `
            <img src="${fileIcons[ext] || defaultIcon}" alt="${ext}" class="file-icon">
            <span class="file-name" data-tooltip="${file}">${fileName}</span>
            <div class="file-actions">
                <i class="fas fa-edit edit-file" title="Edit Name"></i>
                <i class="fas fa-history view-history" title="View History"></i>
                <i class="fas fa-trash delete-file" title="Delete File"></i>
            </div>
        `;

        // Attach actions
        li.querySelector(".edit-file").onclick = () => editFileName(file);
        li.querySelector(".view-history").onclick = () => showFileHistory(file);
        li.querySelector(".delete-file").onclick = () => openDeleteModal(file);

        fileList.appendChild(li);
    });
}
  
  
  // Open Delete Modal
  function openDeleteModal(file) {
    currentFileToDelete = file;
    modalMessage.textContent = `Are you sure you want to delete "${file}"?`;
    modal.style.display = "flex";
  
    confirmAction.onclick = () => {
      deleteFile(currentFileToDelete);
    };
  
    cancelAction.onclick = closeModal;
  }
  
  function deleteFile(file) {
    const ext = file.match(/\.\w+$/)?.[0] || "";
  
    // Remove the file from categorizedFiles
    if (categorizedFiles[ext]) {
      categorizedFiles[ext] = categorizedFiles[ext].filter(f => f !== file);
      if (categorizedFiles[ext].length === 0) delete categorizedFiles[ext];
    }
  
    // Add the file to the bin (if not already present)
    if (!bin.includes(file)) {
      bin.push(file);
      logHistory(file, "Moved to Bin");
    }
  
    // Update the currentFiles to remove the file
    currentFiles = currentFiles.filter(f => f !== file);
  
    // Update the UI
    renderFiles();
    renderBin();
    renderFolders();
    closeModal();
  }
  
  function renderBin() {
    binList.innerHTML = "";
  
    if (bin.length === 0) {
      binList.innerHTML = `
        <div class="bin-placeholder">
          <i class="fas fa-trash-alt" style="font-size: 2rem; color: var(--gray);"></i>
          <p style="color: var(--dark-gray);">No files in the bin</p>
        </div>
      `;
      return;
    }
  
    bin.forEach(file => {
      const li = document.createElement("li");
      li.classList.add("bin-item");
      li.textContent = file;
  
      // Restore Icon Button
      const restoreBtn = document.createElement("button");
      restoreBtn.classList.add("restore-icon");
      restoreBtn.title = "Restore";
      restoreBtn.innerHTML = `<i class="fas fa-undo"></i>`;
  
      // Add click functionality
      restoreBtn.onclick = () => restoreFile(file);
  
      // Append to the list
      li.appendChild(restoreBtn);
      binList.appendChild(li);
    });
  }

  function showFileOptions(file) {
    const fileName = file.replace(/\.\w+$/, '');
  
    // Open confirmation modal with actions
    modal.style.display = 'flex';
    modalMessage.innerHTML = `
      <div style="margin-bottom: 10px; font-weight: 600;">
        File Options for "<span style="color: var(--red-accent)">${fileName}</span>"
      </div>
      <div style="display: flex; justify-content: center; gap: 15px;">
        <button id="editFileName" class="file-action-btn">
          <i class="fas fa-edit"></i> Edit Name
        </button>
        <button id="viewFileHistory" class="file-action-btn">
          <i class="fas fa-history"></i> View History
        </button>
        <button id="deleteFile" class="file-action-btn">
          <i class="fas fa-trash-alt"></i> Delete File
        </button>
      </div>
    `;
  
    // Add listeners to buttons
    document.getElementById('editFileName').onclick = () => editFileName(file);
    document.getElementById('viewFileHistory').onclick = () => showFileHistory(file);
    document.getElementById('deleteFile').onclick = () => confirmDelete(file);
  }
  
  function restoreFile(file) {
    const ext = file.match(/\.\w+$/)?.[0] || "";
  
    // Add file back to categorizedFiles
    if (!categorizedFiles[ext]) {
      categorizedFiles[ext] = [];
    }
    if (!categorizedFiles[ext].includes(file)) {
      categorizedFiles[ext].push(file);
    }
  
    // Remove file from the bin
    bin = bin.filter(f => f !== file);
  
    logHistory(file, "Restored");
  
    // Update UI
    renderFiles();
    renderBin();
    renderFolders();
  }
  
  clearBinBtn.onclick = () => {
    // Check if the bin is empty
    if (bin.length === 0) {
      // If bin is empty, do nothing and show a message or handle it as needed
      alert("The bin is already empty!");
      return; // Exit the function early if the bin is empty
    }
  
    // Show confirmation modal if bin is not empty
    const clearBinModal = document.getElementById('clearBinModal');
    clearBinModal.style.display = 'flex';
  
    // Handle Confirm Action (Delete Files)
    const confirmClearBin = document.getElementById('confirmClearBin');
    confirmClearBin.onclick = () => {
      // Log all files being permanently deleted
      bin.forEach(file => logHistory(file, 'Permanently Deleted'));
  
      // Clear the bin completely
      bin = [];
  
      // Update UI
      renderBin(); // Clear the bin UI
  
      // Close the modal after action
      clearBinModal.style.display = 'none';
    };
  
    // Handle Cancel Action (Close Modal)
    const cancelClearBin = document.getElementById('cancelClearBin');
    cancelClearBin.onclick = () => {
      clearBinModal.style.display = 'none'; // Close the modal without action
    };
  };
  
// Close File History Modal

closeHistory.addEventListener('click', () => {
  const historyModal = document.getElementById('historyModal');
  historyModal.style.display = 'none';
});


// Confirm Action (Delete the File)
confirmAction.onclick = () => {
    // Perform file deletion
    deleteFile(currentFileToDelete); // Pass the current file to delete
    closeModal();
  };
  
  // Cancel Action (Simply Close Modal)
  cancelAction.onclick = closeModal;
  
  // Open Delete Modal
  let currentFileToDelete = null; // Keep track of which file is to be deleted
  function openDeleteModal(file) {
    currentFileToDelete = file; // Assign file to be deleted
    modalMessage.textContent = `Are you sure you want to delete "${file}"?`;
    modal.style.display = 'flex'; // Display the modal
  }
  function deleteFile(file) {
    const ext = file.match(/\.\w+$/)?.[0] || "";
  
    // Remove file from categorizedFiles
    if (categorizedFiles[ext]) {
      categorizedFiles[ext] = categorizedFiles[ext].filter(f => f !== file);
      if (categorizedFiles[ext].length === 0) {
        delete categorizedFiles[ext];
      }
    }
  
    // Update currentFiles
    currentFiles = currentFiles.filter(f => f !== file);
  
    // Add file to the bin (if not already present)
    if (!bin.includes(file)) {
      bin.push(file);
      logHistory(file, "Moved to Bin");
    }
  
    // Update the UI
    renderFiles();
    renderBin();
  }

  function logHistory(file, action) {
    const timestamp = new Date().toLocaleString();
    if (!fileHistory[file]) fileHistory[file] = [];
    fileHistory[file].push(`${action} at ${timestamp}`);
  }
  
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    const filteredFiles = currentFiles.filter(file => file.toLowerCase().includes(query));
    
    fileList.innerHTML = '';
  
    if (filteredFiles.length === 0) {
      showPlaceholderMessage();
      return;
    }
  
    filteredFiles.forEach(file => {
      const ext = file.match(/\.\w+$/)?.[0] || '';
      const li = document.createElement('li');
      li.classList.add('file-card');
      li.innerHTML = `
        <img src="${fileIcons[ext] || defaultIcon}" alt="icon">
        <span class="file-name" data-tooltip="${file}">${file.replace(ext, '')}</span>
      `;
      fileList.appendChild(li);
    });
  });
  // Sort Files
  sortToggle.addEventListener('click', () => {
    sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
  
    currentFiles.sort((a, b) => {
      const nameA = a.match(/\d+/) ? parseInt(a.match(/\d+/)[0]) : a; // Extract numbers or keep as string
      const nameB = b.match(/\d+/) ? parseInt(b.match(/\d+/)[0]) : b;
  
      if (sortOrder === 'asc') {
        return nameA > nameB ? 1 : -1;
      } else {
        return nameA < nameB ? 1 : -1;
      }
    });
  
    renderFiles();
    sortToggle.innerHTML = `<i class="fas fa-sort"></i> Sort: ${sortOrder === 'asc' ? 'Asc' : 'Desc'}`;
  });
  
  // Close Modal
  function closeModal() {
    modal.style.display = 'none';
  }
  
  function editFileName(file) {
    const ext = file.match(/\.\w+$/)?.[0] || '';
    const oldFileName = file.replace(ext, '');
  
    // Locate file card and file name span
    const fileCards = document.querySelectorAll('.file-card');
    fileCards.forEach(card => {
      const fileNameElement = card.querySelector('.file-name');
      if (fileNameElement.getAttribute('data-tooltip') === file) {
        // Remove ellipsis for editing
        fileNameElement.style.whiteSpace = 'normal';
        fileNameElement.style.overflow = 'visible';
  
        // Replace the file name with an input field
        fileNameElement.innerHTML = `
          <input type="text" value="${oldFileName}" class="edit-input" />
        `;
  
        const inputField = fileNameElement.querySelector('.edit-input');
  
        // Function to save the new file name dynamically
        function saveFileName() {
          const newFileName = inputField.value.trim();
          if (newFileName && newFileName !== oldFileName) {
            const newFile = newFileName + ext;
  
            // Update categorizedFiles dynamically
            categorizedFiles[currentCategory] = categorizedFiles[currentCategory].map(f =>
              f === file ? newFile : f
            );
  
            // Log history of the change
            logHistory(file, `Renamed to "${newFile}"`);
  
            // Update file name in the current files list
            currentFiles = categorizedFiles[currentCategory];
  
            // Refresh the UI
            renderFiles();
          } else {
            // If invalid input, revert to the original state
            renderFiles();
          }
        }
  
        // Event Listeners
        inputField.addEventListener('blur', saveFileName); // Save on losing focus
        inputField.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            saveFileName();
          }
        });
  
        inputField.focus(); // Automatically focus on the input
      }
    });
  }
  
  function showFileHistory(file) {
    const historyModal = document.getElementById('historyModal');
    const historyList = document.getElementById('historyList');
  
    // Fetch file history or display default message
    const history = fileHistory[file] && fileHistory[file].length > 0 
      ? fileHistory[file] 
      : ["No history available."];
  
    // Dynamically render the history list
    historyList.innerHTML = history
      .map(entry => 
        entry === "No history available."
          ? `<li style="text-align: center; color: var(--gray); font-weight: 500;">${entry}</li>`
          : `<li><i class="fas fa-check-circle" style="color: green; margin-right: 8px;"></i>${entry}</li>`
      )
      .join('');
  
    // Show the modal
    historyModal.style.display = 'flex';
  
    // Close button functionality
    document.getElementById('closeHistory').onclick = closeHistoryModal;
    document.getElementById('closeHistoryFooter').onclick = closeHistoryModal;
  }
  
  function closeHistoryModal() {
    const historyModal = document.getElementById('historyModal');
    historyModal.style.display = 'none';
  }





  // Initialize App
  document.addEventListener('DOMContentLoaded', () => {
    categorizeFiles();
    renderFolders();
    showPlaceholderMessage(); 
    renderBin();
  });