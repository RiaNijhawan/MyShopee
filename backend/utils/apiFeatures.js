class ApiFeatuers {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    search() {
        const keyword = this.queryString.keyword ? {
            name: {
                $regex: this.queryString.keyword,
                $options: 'i'
            },
        } : {}

        this.query = this.query.find({...keyword});
        return this;
    }

    filter() {
        const queryCopy = { ...this.queryString }
        // console.log(queryCopy);
        // removing some fileds for category

        const removeFields = ["keyword", "page", "limit"];
        removeFields.forEach(key => delete queryCopy[key]);

        //filter for price ranges
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        // console.log(queryCopy);
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    pagination(resultPerPage) {
        const currentPage = (this.queryString.page) * 1 || 1;
        const skip = resultPerPage * (currentPage - 1);
        this.query = this.query.limit(resultPerPage).skip(skip);
        return this;
    }
}

module.exports = ApiFeatuers;