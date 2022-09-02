class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    search() {
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: "i"
            }
        } : {};
        this.query = this.query.find({ ...keyword});
        return this;
    }

    filter() {
        const queryCopy = { ...this.queryStr };

        // Remove some fields from category
        // console.log(queryCopy);
        const removeFields = ["page", "keyword", "limit"];
        removeFields.forEach((key) => delete queryCopy[key]);
        // console.log(queryCopy);

        // filter the price and rating
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

        // console.log(queryStr);
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    pagination(resultPerPage) {
        const curruntPage = Number(this.queryStr.page) || 1;

        const skip = resultPerPage * (curruntPage - 1);
        this.query = this.query.limit(resultPerPage).skip(skip);
        return this;
    }
    
    // filter() {
    //     const queryObj = { ...this.queryString };
    //     const excludedFields = ['page', 'sort', 'limit', 'fields'];
    //     excludedFields.forEach(el => delete queryObj[el]);
    
    //     let queryStr = JSON.stringify(queryObj);
    //     queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    
    //     this.query = this.query.find(JSON.parse(queryStr));
    
    //     return this;
    // }
    
    // sort() {
    //     if (this.queryString.sort) {
    //     const sortBy = this.queryString.sort.split(',').join(' ');
    //     this.query = this.query.sort(sortBy);
    //     } else {
    //     this.query = this.query.sort('-createdAt');
    //     }
    
    //     return this;
    // }
    
    // limitFields() {
    //     if (this.queryString.fields) {
    //     const fields = this.queryString.fields.split(',').join(' ');
    //     this.query = this.query.select(fields);
    //     } else {
    //     this.query = this.query.select('-__v');
    //     }
    
    //     return this;
    // }
    
    // paginate() {
    //     const page = this.queryString.page * 1 || 1;
    //     const limit = this.queryString.limit * 1 || 100;
    //     const skip = (page - 1) * limit;
    
    //     this.query = this.query.skip(skip).limit(limit);
    
    //     return this;
    // }
}

module.exports = ApiFeatures;