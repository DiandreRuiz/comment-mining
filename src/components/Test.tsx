import { getVideoComments } from "../services/googleApiYoutube";

const Test = () => {
    const test = async () => {
        const data = await getVideoComments("CQMei8uYZtQ");
        return data;
    };
    const data = test();
    console.log(data);
    return <p className="text-center">Testing</p>;
};

export default Test;
