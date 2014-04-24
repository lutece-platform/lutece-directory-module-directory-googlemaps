/*
 * Copyright (c) 2002-2014, Mairie de Paris
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 *  1. Redistributions of source code must retain the above copyright notice
 *     and the following disclaimer.
 *
 *  2. Redistributions in binary form must reproduce the above copyright notice
 *     and the following disclaimer in the documentation and/or other materials
 *     provided with the distribution.
 *
 *  3. Neither the name of 'Mairie de Paris' nor 'Lutece' nor the names of its
 *     contributors may be used to endorse or promote products derived from
 *     this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDERS OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 *
 * License 1.0
 */
package fr.paris.lutece.plugins.directory.modules.googlemaps.service;

import fr.paris.lutece.plugins.directory.business.IMapProvider;
import fr.paris.lutece.portal.service.util.AppPropertiesService;
import fr.paris.lutece.util.ReferenceItem;

/**
 * 
 * GoogleMapsProvider : provides Google Maps support for Directory
 *
 */
public class GoogleMapsProvider implements IMapProvider 
{
	private static final String PROPERTY_KEY = "directory-googlemaps.key";
	private static final String PROPERTY_DISPLAYED_NAME = "directory-googlemaps.displayName";
	private static final String TEMPLATE_HTML = "../modules/googlemaps/GoogleMapsTemplate.html";
	private static final String TEMPLATE_FRONT_HTML = "modules/googlemaps/GoogleMapsTemplate.html";
	private static final String TEMPLATE_FRONT_LIST_HTML = "modules/googlemaps/GoogleMapsListTemplate.html";
	private static final String TEMPLATE_BACK_LIST_HTML = "modules/googlemaps/GoogleMapsListTemplate.html";
	
	private static final boolean CONSTANT_MAP_LIST_SUPPORTED = true;
	
	/**
	 * {@inheritDoc}
	 */
	public String getKey(  ) 
	{
		return AppPropertiesService.getProperty( PROPERTY_KEY );
	}
		
	/**
	 * {@inheritDoc}
	 */
	public String getDisplayedName(  ) 
	{
		return AppPropertiesService.getProperty( PROPERTY_DISPLAYED_NAME );
	}
	
	/**
	 * {@inheritDoc}
	 */
	public String getHtmlCode(  ) 
	{
		return TEMPLATE_HTML;
	}
		
	/**
	 * {@inheritDoc}
	 */
	public ReferenceItem toRefItem(  )
	{
		ReferenceItem refItem = new ReferenceItem(  );
		
		refItem.setCode( getKey(  ) );
		refItem.setName( getDisplayedName(  ) );
		
		return refItem;
	}
	
	/**
	 * {@inheritDoc}
	 */
	@Override
	public String toString(  ) 
	{
		return "Google Maps Provider";
	}

	/**
	 * {@inheritDoc}
	 */
	public String getFrontHtmlCode(  ) 
	{
		return TEMPLATE_FRONT_HTML;
	}

	/**
	 * {@inheritDoc}
	 */
	public String getFrontListHtmlCode(  ) 
	{
		return TEMPLATE_FRONT_LIST_HTML;
	}

	/**
	 * {@inheritDoc}
	 */
	public String getBackListHtmlCode(  )
	{
		return TEMPLATE_BACK_LIST_HTML;
	}

	/**
	 * {@inheritDoc}
	 */
	public boolean isMapListSupported(  )
	{
		return CONSTANT_MAP_LIST_SUPPORTED;
	}

}
