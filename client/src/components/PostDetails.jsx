import { formatISO9075 } from "date-fns";
import { Link } from "react-router-dom";
import { TruncateString } from "./Truncate";

const Postdetails = ({ title, summary, file, createdAt, author, _id }) => {
    return (
        <>
                <div key={_id} className="bg-[#030d2e] p-4 md:p-8 rounded-lg shadow-lg">
                    <div className="flex flex-col md:flex-row justify-center flex-wrap mt-4">
                        {/* Image */}
                        <div className="w-full rounded-xl mb-4 md:mb-0">
                            <Link to={`/postdetails/${_id}`}>
                                <img
                                    className="w-full h-[200px] md:h-[300px] border-[5px] border-orange-500 rounded-lg object-cover transition-transform duration-300 hover:scale-105 hover:border-orange-700"
                                    src={file}
                                    alt={title}
                                />
                            </Link>
                        </div>
                        <div className="w-full items-center justify-center ml-0 md:ml-4 text-center mt-8 md:text-left">
                            {/* Title */}
                            <div>

                            <Link to={`/postdetails/${_id}`}>
                                <h1 className="text-orange-500 text-xl md:text-3xl font-bold transition-colors duration-300 hover:text-orange-700">
                                    {title}
                                </h1>
                            </Link>
                            {/* Author */}
                            <h2 className="text-gray-200 text-md md:text-xl mt-2 transition-colors duration-300 hover:text-gray-400">
                                @{author?.username}
                            </h2>
                            {/* Date */}
                            <h2 className="text-gray-200 text-md md:text-xl font-semibold mt-2 transition-colors duration-300 hover:text-gray-400">
                                {formatISO9075(new Date(createdAt))}
                            </h2>
                            {/* Description */}
                            <p className="text-gray-200 text-md md:text-xl mt-2 font-medium transition-colors duration-300 hover:text-gray-400">
                                {TruncateString(summary)}
                            </p>
                            </div>
                        </div>
                    </div>
                </div>
        </>
    );
};

export default Postdetails;
