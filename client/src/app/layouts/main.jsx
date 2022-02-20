import React from "react";
import useMockData from "../utils/mockData";
import config from "../config.json";

const Main = () => {
    const isFireBase = config.isFireBase;
    const { error, initialize, progress, status } = useMockData();
    const handleClick = () => {
        initialize();
    };

    return isFireBase ? (
        <div className="container mt-5">
            <h1> Main Page</h1>
            <h3>Инициализация данных в FireBase</h3>
            <ul>
                <li>Status:{status}</li>
                <li>Progress: {progress}%</li>
                {error && <li>error: {error}</li>}
            </ul>
            <button className="btn btn-primary" onClick={handleClick}>
                {" "}
                Инициализировать
            </button>
        </div>
    ) : (
        <div className="container">
            <div className="row">
                <h4 className="col-md-6 offset-md-3 text-primary text-center">
                    Log in or register
                </h4>
            </div>
        </div>
    );
};

export default Main;
