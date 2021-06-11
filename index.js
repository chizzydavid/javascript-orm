import sampleData from "./data";
import _ from 'lodash'

class User {
	constructor({ id }) {
  	this.id = id;
    this.selectedData = undefined;
    this.finalData = undefined;
    
    this.fieldAttributes = undefined;
    this.whereCondition = undefined;
    this.orderBy = undefined;
  }
  
  select(key) {
  	this.selectedData = _.filter(_.get(sampleData, key), { userId: this.id });
    return this;
  }
  
  attributes(attributesArr) {
    this.fieldAttributes = attributesArr;
    return this;
  }
  
  where(condition) {
    this.whereCondition = condition;
    return this;
  }
  
  order(orderProps) {
		this.orderBy = orderProps;
    return this;   
  }
  
  async findAll() {
  	let results;
    
    if (this.whereCondition) {
    	results = _.filter(this.selectedData, this.whereCondition); 
    }
    
    if (this.orderBy) {
    	results = _.orderBy(results || this.selectedData, this.orderBy, ['asc']);
    }
       
    if (this.fieldAttributes) {
      const filteredArr = [];
      _.forEach(results || this.finalData, (item) => {
        filteredArr.push(_.pick(item, this.fieldAttributes));
      });
      results = filteredArr;
    }    
    this.finalData = results;  
    return this;
  }
  
  async findOne() {
  	await this.findAll();
		this.finalData = this.finalData.length > 0? this.finalData[0] : undefined;
    return this;
  }
}



const user = new User({
	id: 123
});

user
	.select('apps')
  .attributes(['id', 'title'])
  .where({ published: true })
  .order(['title'])
  .findAll()
  .then(function (apps) {
    console.log(apps);
  })
  
user
	.select('organizations')
  .attributes(['name'])
  .where({ suspended: false })
  .findOne()
  .then(function (organization) {
    console.log(organization);
  })
  
