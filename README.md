# Image Search Microservice for FCC

Go to the following url: https://imapi.glitch.me/api/imagesearch/

By adding a search term to the end of the url, you can search google images and be returned a `json` object listing ten search results for that term.

If you add an offset query, i.e. `?offest=`, followed by a number, you will get ten results from the list following that offset. So if you wanted results 77 - 87, you would use `?offset=77`.

Finally, you can retrieve the last ten searches by calling the `/api/latest` endpoint

### Examples

:dizzy: Search Term :dizzy:

* `https://imapi.glitch.me/api/imagesearch/office%20funny`

:dizzy: Offset :dizzy:

* `https://imapi.glitch.me/api/imagesearch/office%20funny?offset=35`

:dizzy: Latest :dizzy:

* `https://imapi.glitch.me/api/latest`

Try clicking here to see this api in action: https://imapi.glitch.me/api/imagesearch/office%20funny?offset=14
