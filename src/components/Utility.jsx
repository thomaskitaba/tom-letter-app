

// TODO: #1   Delay execution for a given milliseconds
     // src/components/Utility.jsx
 export const delay = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
};
