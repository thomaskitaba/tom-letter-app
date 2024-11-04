

// TODO: #1   Delay execution for a given milliseconds
export const delay = (ms) => { 
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms);
    })
}