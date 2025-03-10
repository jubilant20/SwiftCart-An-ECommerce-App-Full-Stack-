package com.springboot.ecommerce.config;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.core.mapping.ExposureConfigurer;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import com.springboot.ecommerce.entity.Product;
import com.springboot.ecommerce.entity.ProductCategory;

import jakarta.persistence.EntityManager;
import jakarta.persistence.metamodel.EntityType;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer
{
	private EntityManager entityManager;
	
	@Autowired
	public MyDataRestConfig(EntityManager theEntityManager) {
		entityManager= theEntityManager;
	}

	@Override
	public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) 
	{
		HttpMethod[] theUnsupportedActions = {HttpMethod.PUT, HttpMethod.POST, HttpMethod.DELETE};
		
		//disabling HTTP methods for Product: PUT, POST and DELETE
		
		config.getExposureConfiguration()
				.forDomainType(Product.class) 
				.withItemExposure((metdata, httpMethods) -> httpMethods.disable(theUnsupportedActions))
				.withCollectionExposure((metdata,httpMethods) -> httpMethods.disable(theUnsupportedActions));
		
		//disabling the HTTP methods for ProductCategory: PUT, POST and DELETE
		//The methods .withItemExposure and .withCollectionExposure are part of the Spring Data REST configuration 
		//used to customize the exposure of entity resources in the REST API.
		config.getExposureConfiguration()
			.forDomainType(ProductCategory.class) 
			.withItemExposure((metdata, httpMethods) -> httpMethods.disable(theUnsupportedActions))
			.withCollectionExposure((metdata,httpMethods) -> httpMethods.disable(theUnsupportedActions));
		
		//call an internal helper method
		// This method is responsible for exposing the IDs of all JPA entities in the REST API.
		//By default, Spring Data REST does not expose entity IDs in the JSON responses. This method modifies that behavior to include the IDs.
		exposeIds(config);
	}
	private void exposeIds(RepositoryRestConfiguration config) {
		//expose entity id
		
		//-get a list of all entity classes from the entity manager
		Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();
		
		//create an array of the entity types
		List<Class> entityClasses = new ArrayList<>();
		
		//-get the entity types for the entities
		for(EntityType tempEntityType : entities)
		{
			entityClasses.add(tempEntityType.getJavaType());
		}
		
		//-expose the entity ids for the array of entity/domain types
		Class[] domainTypes = entityClasses.toArray(new Class[0]);
		config.exposeIdsFor(domainTypes);
	}
}
