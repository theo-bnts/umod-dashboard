class Tools {
    static selectNameObject(array, id) {
        return {
            current: array.find(object => object.id === id)
                || { id, name: 'Unknown (' + id + ')' },
            available: array
        }
    }
}

export default Tools