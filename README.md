# URL-Shortener

Back-End architecture for a URL shortener. Implemented with Node, MySQL, and Redis.

For example, a long URL like: https://stackoverflow.com/questions/1427272/for-loop-construction-and-code-complexity will be shortened to https://short.url/6brm. Upon visiting the short URL, the user will be redirected to the original long URL.

# Implementation

Long URLs along with their corresponding short URL are stored in a relation database. The short URL is created by base 89 encoding the Id of the record that corresponds to the long URL. Most traditional URL shorteners choose to implement a base 62 encoding to only allow 0-9, A-Z, and a-z in their URLs. I'm including all 62 of those characters as well as some other characters (that are all allowed in URLs) like !, @, # etc. The advantage is that I can create more URLs with less characters. The disadvantage is that the generated URLs will have special characters. By using 89 characters I can create 89^4 = 62,742,241 URLs with 4 characters or less appended to the short URL domain. Whereas with base 62 encoding you could only create 62^4 = 14,776,336, a difference of around 48 million.

# Performance Improvements

I'm utilizing Redis to cache as much data as possible. Upon creation, short URLs along with their corresponding long URLs are all cached for 24 hours. Upon read, if the value is not found in the cache, it's searched for in the database and the value is cached for 24 hours.

I'm also utilizing HTTP `301 Moved Permanently`, status code in my response. 301 indicates to the browser that it is a permanent redirect. As a result, the browser will cache the results of the redirect and will reduce the number of calls to my server if the short URL is used again.
