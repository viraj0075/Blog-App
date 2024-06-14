import { formatISO9075 } from "date-fns";
import {Link} from "react-router-dom";


const Postdetails = ({ title, summary, file, text, createdAt, author,_id }) => {
    // console.log(title,summary)
    return (
        <>
            <div key={_id} className="">
                {/* image */}
                <div className="flex justify-center flex-wrap mt-4">
                    <div className="rounded-xl">
                        <Link to={`/postdetails/${_id}`}>
                            <img
                                className="w-[400px] h-[310px] border-[5px] border-orange-200 rounded-lg object-cover mt-8 lg:ml-[4rem] ml-2 transition-transform duration-300 hover:scale-105 hover:border-orange-500"
                                src={file}
                                alt=""
                            />
                        </Link>
                    </div>
                    <div className="ml-[3.54rem] mt-8">
                        {/* title */}
                        <Link to={`/postdetails/${_id}`}>
                        <h1 className="text-orange-500 text-3xl font-bold transition-colors duration-300 hover:text-orange-700">{title}</h1>
                        </Link>
                        {/* Author */}
                        <h1 className="text-white text-xl  mt-2 transition-colors duration-300 hover:text-gray-400">@{author?.username}</h1>
                        {/* Date */}
                        <h1 className="text-white text-xl  font-semibold mt-2 transition-colors duration-300 hover:text-gray-400">{formatISO9075(new Date(createdAt))}</h1>
                        {/* Description */}
                        <h1 className="text-white text-xl mt-2 font-medium w-full md:w-[400px] lg:w-[600px] transition-colors duration-300 hover:text-gray-400">{summary}</h1>
                    </div>
                </div>
            </div>


        </>
    )
}
export default Postdetails;