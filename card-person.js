/**
 * @param {Object} doc
 */
function cardPerson(doc)
{
	var pid = doc['pid'];
	var name = formatName(doc['name']);
	var type = doc['type'] || '';
	
	
	var res = '';
	
	res += '<div class="person card" data-pid="' + pid + '">';
	{
		// left column
		res += '<div>';
		{
			//header
			res += '<header>';
			{
				res += '<h1 class="address">';
				{
					if(pid)
						res += '<a href="#/people/' + pid + '">' + name + '</a>';
					else
						res += name;
				}
				res += '</h1>';
				
				res += '<h2 class="type">' + type + '</h2>';
				
				res += htmlAddressProperty(doc);
			}
			res += '</header>';
		}
		res += '</div>';
		
		
		res += '<div>';
			
			if(typeof(doc['num_properties_owned']) === 'number') res += 'Owned: ' + doc['num_properties_owned'];
			if(typeof(doc['num_properties_occupied']) === 'number') res += 'Occupied: ' + doc['num_properties_occupied'];
			
		res += '</div>';
	}
	res += '</div>';
	
	return res;
}


/**
 * @param {Object} item
 */
function cardPersonTracked(item)
{
	var doc = item['consumer'];
	var is_in_cart = item['is_in_cart'] === true;
	var pid = doc['pid'];
	var res = '';
	
	res += '<li class="' + (item['is_example'] ? 'example' : '') + '">';
	{
		res += '<div class="card-container">';
		{
			res += '<input type="checkbox" name="selected" ' + (is_in_cart ? ' checked="checked"' : '') + '/>'
				+ '<label></label>';
			
			res += cardPerson(doc);
			
			res += '<div class="actions2">';
			{
				res += '<button class="more dropdown">'
					res += '<svg class="icon"><use xlink:href="#icon-dots-horizontal"></use></svg>';

					res += '<ul class="dropdown-menu">';
						res += '<li class="remove-from-tracked" data-pid="' + pid + '"><svg class="icon"><use xlink:href="#icon-remove-from-tracked"></use></svg><span>Remove</span></li>';	
					res += '</ul>';
				res += '</button>';
			}
			res += '</div>';
		}
		res += '</div>';
	}
	res += '</li>';
	
	
	var $card = $(res)
		.on('change', 'input[type="checkbox"][name="selected"]', toggleCartPerson)
		.on('click', '.remove-from-tracked', untrackPerson)
		.on('click', '.remove-from-tracked', function()
		{
			//TODO: animate the remove, and add a toast with an undo button
			$(this).closest('div.card-container').closest('li').remove();
		})
		.data('person', doc)
		.data('pid', pid);
	
	if(is_in_cart)
		$card.addClass('cart');
	
	return $card;
}