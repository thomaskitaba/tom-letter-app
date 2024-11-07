

// TODO: #1   Delay execution for a given milliseconds
     // src/components/Utility.jsx
 export const delay = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
};


    
export const calculateFileSize = (fileSize) => {
    if (fileSize >= 1024 && fileSize < (1024 * 1024)) {
    fileSize = `${fileSize / 1024} KB`;
    }else if (fileSize >= (1024 * 1024) && fileSize < (1024 * 1024 * 1024)) {
    fileSize = `${Math.ceil(fileSize / (1024 * 1024))} MB`;
    }
}