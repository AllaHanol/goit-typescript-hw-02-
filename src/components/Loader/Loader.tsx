import { Audio } from 'react-loader-spinner';
import { string } from 'yup';
const Loader = () => {

    return (
        <>
            <Audio
                height="80"
                width="80"
                radius="9"
                color="green"
                ariaLabel="loading"
                wrapperStyle = {{}}
                wrapperClass = ""
            />
        </>
    )
}

export default Loader;
