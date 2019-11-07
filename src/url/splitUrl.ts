export interface UrlComponents {
	url: string;
	queryString: string;
	hash: string;
}

const splitUrl = (url: string): UrlComponents => {
	const [urlAndQuery, _hash] = url.split('#');
	const [_url, _query] = urlAndQuery.split('?');
	return {
		url: _url || '',
		queryString: _query || '',
		hash: _hash || '',
	};
};

export default splitUrl;
