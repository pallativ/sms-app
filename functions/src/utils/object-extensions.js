exports.buildObjectFromDoc = function(document, fields = [])
{
    if (!document)
        return null;

    const result = {};
    result["id"] = document.id;
    var item = document.data();
    for (const field of fields) {
        if (field in item) {
            result[field] = item[field];
        }
    }
    return result;
}
