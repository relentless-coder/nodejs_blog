export function errorHandler(err){
	if(err.response){
		console.log(err.response.status);
		console.log(err.response.message);
	} else if(err.request){
		console.log(err);
	} else {
		console.log(err);
	}
}
