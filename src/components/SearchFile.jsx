import {useState, useContext} from 'react';
import MyContext from './MyContext';

const SearchFile = () => {
    const {endpoint, setEndpoint} = useContext(MyContext);
    return (
        <>
            <div className="test-container">
                <h1>Search File</h1>
                <h1>{endpoint}</h1>
            </div>
        </>
    )
}
export default SearchFile;
