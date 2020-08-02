export const hashtagRegex = /#[\w-]+/g;

export const findHashtagEntries = entries => 
    entries.filter(x => x.summary.search(hashtagRegex) >= 0);

export const getHashtags = text => text.match(hashtagRegex);

export const unHash = text => text.replace(/#/, "").replace(/-/g, " ");
