type StatCardProps = {
    title:string;
    value:string | number ;
    color?:string;
};

export default function StatCard({title,value,color}:StatCardProps){
    return (
        <div className="bg-white shadow rounded p-6 text-center">
            <h3 className="text-gray-500">{title}</h3>

            <p className={`text-3xl font-bold ${color || "text-black"}`}>
                {value}
            </p>
        </div>
    );
}