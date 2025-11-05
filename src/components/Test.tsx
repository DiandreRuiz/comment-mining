import { getTop3VideosByViews, getVideoComments } from "../services/googleApiYoutube";

const Test = () => {
    const test = async () => {
        const data = await getVideoComments("CQMei8uYZtQ");
        return data;
    };
    const data = test();
    console.log(data);
    return <p>Testing</p>;
};

export default Test;
