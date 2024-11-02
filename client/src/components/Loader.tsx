import React, { FunctionComponent } from 'react';
import loaderIcon from '../assets/loader-icon.png';

type LoaderProps = {
    loadingMessage: string,
};

const Loader: FunctionComponent<LoaderProps> = ({ loadingMessage }) => {
    return (
        <div className={`flex flex-col justify-center items-center w-screen h-screen bg-black`}>
            <div className="flex flex-col items-center text-center mb-12">
                <h1 className='primary grenze'>Depths</h1>
                <h1 className='primary grenze'>Of</h1>
                <h1 className='primary grenze'>DreaD</h1>
            </div>
            <img
                src={loaderIcon}
                className="animate-spin"
            />
        </div>
    );
};

export default Loader;