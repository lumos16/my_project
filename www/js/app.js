//Ionic Starter App

//angular.module is a global place for creating, registering and retrieving Angular modules
//'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
//the 2nd parameter is an array of 'requires'
angular.module('cisco_quoter', ['ionic','ngCookies'])

.run(function($ionicPlatform)
		{
	$ionicPlatform.ready(function()
			{
		if(window.cordova && window.cordova.plugins.Keyboard)
		{
			// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
			// for form inputs)
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

			// Don't remove this line unless you know what you are doing. It stops the viewport
			// from snapping when text inputs are focused. Ionic handles this internally for
			// a much nicer keyboard experience.
			cordova.plugins.Keyboard.disableScroll(true);
		}
		if(window.StatusBar)
		{
			StatusBar.styleDefault();
		}
			});
		})

		.controller('cisco_quoter_controller', function($scope, $cookies, $ionicSideMenuDelegate, $window, $http, $compile)
				{
			$scope.quote_offset = 1;
			$scope.max_rows_in_table = 5;
			$scope.quote_search_keyword_input = "";
			$scope.auth_token = "";
			$scope.user_id = null;

			$scope.GetOrders = function(offset)
			{
				$http(
						{
							method : "GET",
							url : "http://ccrc-mobile-poc-01:3600/orderService/orders?from=" + offset + "&limit=" + $scope.max_rows_in_table,
							headers : {"Authorization": $scope.auth_token, "Request-Id": $scope.reqgen()}
						})
						.success(function(response)
								{
							$scope.showOrders(response);
								});
			}

			$scope.GetQuotes = function(offset)
			{
				$http(
						{
							method : "GET",
							url : "http://ccrc-sc-dev.cisco.com/ServiceContract-main/ccrcesservices/quotes?sort=last_modified&order=desc&limit=" + $scope.max_rows_in_table + "&offset=" + offset,
							headers : { "Authorization": $scope.auth_token, "Request-Id": $scope.reqgen() }
						})
						.success(function(response)
								{

							$scope.showQuotes(response);
								});
			}

			$scope.reqgen = function() {
				return "111";
			}

			$scope.getAuthToken = function()
			{
				$http(
						{
							method : "POST",
							url : "https://ccrc-sc-stg.cisco.com/ServiceContract-main/qotservice/security/getAccessToken",
							headers: {'Content-Type': 'application/json', 'user': $scope.user_id, 'password': $scope.password}
						})
						.success(function(data)
								{
							if(data.description == "Success")
							{
								$scope.auth_token = data.Authorization;
								$cookies.auth_token = $scope.auth_token;
								$scope.LoadHomeUI();
							}
							else if(data.statusCode == "Failed")
							{
								document.getElementById('notification').innerHTML ="Incorrect username/password. Login Failed";
								$compile(document.getElementById('notification'))($scope);
							} else {
								document.getElementById('notification').innerHTML ="Unknown error";
								$compile(document.getElementById('notification'))($scope);
							}
								})
								.error(function()
										{
									document.getElementById('notification').innerHTML ="Failed to connect. Try again later";
									$compile(document.getElementById('notification'))($scope);
										});
			}

			$scope.LoadLoginUI = function()
			{
				document.getElementById('pagecontent').innerHTML ='<div class = "row" id="form_element"><div class = "col"><h2 style="color: #38659E;">Log In</h2><br><form name="myform" ng-submit = "getAuthToken()"><div class="list"><label class="item item-input"><input type="text" placeholder="Username" ng-model="user_id" required></label><label class="item item-input"><input type="password" placeholder="Password" ng-model="password" required></label><br><button class="button" style="background-color: #38659E; width: 100%;">Login</div></form><div class="card" ng-show="myform.$submitted"><div class="item item-text-wrap" id="notification"></div></div></div></div>';
				$compile(document.getElementById('pagecontent'))($scope);
			}

			$scope.LoadHomeUI = function()
			{
				document.getElementById('pagecontent').innerHTML = "<ion-side-menus><ion-side-menu-content><div id = 'content' style = 'text-align: justify; padding: 5%;'><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p></div></ion-side-menu-content><ion-side-menu side = 'left' type='overlay'><ion-list><ion-item ng-click = 'LoadHomeUI()'>Home</ion-item></ion-list><ion-list><ion-item ng-click = 'LoadViewOrdersUI()'>View Orders</ion-item></ion-list><ion-list><ion-item ng-click = 'LoadViewQuotesUI()'>View Quotes</ion-item></ion-list></ion-side-menu></ion-side-menus>";
				$compile(document.getElementById('pagecontent'))($scope);
			}

			$scope.LoadViewOrdersUI = function()
			{
				document.getElementById('pagecontent').innerHTML = '<ion-side-menus><ion-side-menu-content><div class="list list-inset"><form ng-submit="PrepareOrderSearch()"><label class="item item-input"><input type="text" placeholder="Search Order Number" ng-model="order_search_keyword_input"><button class = "button button-clear"><i class="icon ion-search placeholder-icon"></i></button></label></form></div><div class="table" id="order_table"></div><div class = "row" style = "text-align: center"><div class = "col"><button class = "button icon ion-arrow-left-b" ng-click="OrdersPrevSet()"></button></div><div class = "col">{{ page_number }} / {{ total_number_of_pages }}</div><div class = "col"><button class="button icon ion-arrow-right-b" ng-click="OrdersNextSet()"></button></div></div></ion-side-menu-content><ion-side-menu side = "left" type="overlay"><ion-list><ion-item ng-click = "LoadHomeUI()">Home</ion-item></ion-list><ion-list><ion-item ng-click = "LoadViewOrdersUI()">View Orders</ion-item></ion-list><ion-list><ion-item ng-click = "LoadViewQuotesUI()">View Quotes</ion-item></ion-list></ion-side-menu></ion-side-menus>';
				$scope.page_number = 1;
				$scope.total_number_of_pages = 1;
				$scope.order_offset = 1;
				$scope.order_search_is_on = false;
				$scope.order_search_keyword_input = "";
				$scope.GetOrders($scope.order_offset);
				$compile(document.getElementById('pagecontent'))($scope);
			}

			$scope.LoadViewQuotesUI = function()
			{
				document.getElementById('pagecontent').innerHTML = '<ion-side-menus><ion-side-menu-content><div class="list list-inset"><form ng-submit="PrepareQuoteSearch()"><label class="item item-input"><input type="text" placeholder="Search Quote Number" ng-model="quote_search_keyword_input"><button class = "button button-clear"><i class="icon ion-search placeholder-icon"></i></button></label></form></div><div class="table" id="quote_table"></div><div class = "row" style = "text-align: center"><div class = "col"><button class = "button" ng-click="firstPage()">First Page</button></div><div class = "col"><button class = "button icon ion-arrow-left-b" ng-click="QuotesPrevSet()"></button></div><div class = "col">{{ page_number }} / {{ total_number_of_pages }}</div><div class = "col"><button class="button icon ion-arrow-right-b" ng-click="QuotesNextSet()"></button></div><div class = "col"><button class = "button" ng-click="lastPage()">Last Page</button></div></div></ion-side-menu-content><ion-side-menu side = "left" type="overlay"><ion-list><ion-item ng-click = "LoadHomeUI()">Home</ion-item></ion-list><ion-list><ion-item ng-click = "LoadViewOrdersUI()">View Orders</ion-item></ion-list><ion-list><ion-item ng-click = "LoadViewQuotesUI()">View Quotes</ion-item></ion-list></ion-side-menu></ion-side-menus>';
				$scope.page_number = 1;
				$scope.total_number_of_pages = 1;
				$scope.quote_offset = 1;
				$scope.quote_search_is_on = false;
				$scope.quote_search_keyword_input = "";
				$scope.GetQuotes($scope.quote_offset);
				$compile(document.getElementById('pagecontent'))($scope);
			}

			$scope.min = function(x, y)
			{
				if(x < y) return x;
				return y;
			}

			$scope.OrdersNextSet = function()
			{
				if($scope.page_number < $scope.total_number_of_pages)
				{
					$scope.order_offset += $scope.max_rows_in_table;
					$scope.page_number += 1;
					if($scope.order_search_is_on) $scope.SearchOrders($scope.order_search_keyword, $scope.order_offset);
					else $scope.GetOrders($scope.order_offset);
				}
			}

			$scope.OrdersPrevSet = function()
			{
				if($scope.page_number > 1)
				{
					$scope.order_offset -= $scope.max_rows_in_table;
					$scope.page_number -= 1;
					if($scope.order_search_is_on) $scope.SearchOrders($scope.order_search_keyword, $scope.order_offset);
					else $scope.GetOrders($scope.order_offset);
				}
			}

			$scope.QuotesNextSet = function()
			{
				if($scope.page_number < $scope.total_number_of_pages)
				{
					$scope.quote_offset += $scope.max_rows_in_table;
					$scope.page_number += 1;
					if($scope.quote_search_is_on) $scope.SearchQuotes($scope.quote_search_keyword, $scope.quote_offset);
					else $scope.GetQuotes($scope.quote_offset);
				}
			}

			$scope.QuotesPrevSet = function()
			{
				if($scope.page_number > 1)
				{
					$scope.quote_offset -= $scope.max_rows_in_table;
					$scope.page_number -= 1;
					if($scope.quote_search_is_on) $scope.SearchQuotes($scope.quote_search_keyword, $scope.quote_offset);
					else $scope.GetQuotes($scope.quote_offset);
				}
			}

			$scope.loadQuoteDetails = function(quoteId) {
				$window.alert(quoteId);
				$http({
					method: "GET",
					url: "http://ccrc-mobile-poc-01:8888/quotes/"+ quoteId + "/lines",
					headers: {"Authorization": $scope.auth_token, "Request-Id": $scope.reqgen()}
				}). success(function(response){
					if(response.statusCode == 200) {
						$window.alert("present!");
						document.getElementById('pagecontent').innerHTML ='<ion-side-menus><ion-side-menu-content><div class="list list-inset"><div id="quote_lines"></div></div></ion-side-menu-content><ion-side-menu side = "left" type="overlay"><ion-list><ion-item ng-click = "LoadHomeUI()">Home</ion-item></ion-list><ion-list><ion-item ng-click = "LoadViewOrdersUI()">View Orders</ion-item></ion-list><ion-list><ion-item ng-click = "LoadViewQuotesUI()">View Quotes</ion-item></ion-list></ion-side-menu></ion-side-menus>';
						$compile(document.getElementById('pagecontent'))($scope);
						for(i=0;i<response.major.length;i++) {
							//$window.alert(response[i].quoteDTO.header.createdBy);
							//document.getElementById('pagecontent').innerHTML ='<ion-side-menus><ion-side-menu-content><div class="list list-inset"><div class="row"><div class="col">Quote Number</div><div class="col">'+ response[i].quoteId + '</div></div><div class="row"><div class="col">Created By</div><div class="col">'+ response[i].quoteDTO.header.createdBy + '</div></div><div class="row"><div class="col">Last updated By</div><div class="col">'+ response[i].quoteDTO.header.lastUpdatedBy + '</div></div></div></ion-side-menu-content><ion-side-menu side = "left" type="overlay"><ion-list><ion-item ng-click = "LoadHomeUI()">Home</ion-item></ion-list><ion-list><ion-item ng-click = "LoadViewOrdersUI()">View Orders</ion-item></ion-list><ion-list><ion-item ng-click = "LoadViewQuotesUI()">View Quotes</ion-item></ion-list></ion-side-menu></ion-side-menus>';
							majorObj = JSON.parse(response.major[i]);
							var lines ='<div class="row"><div class="col">Serial Number</div><div class="col">' + majorObj.quoteMajorLines.serialNumber + '</div></div><div class="row"><div class="col">Extended List Price</div><div class="col">' + majorObj.quoteMajorLines.extendedListPrice + '</div></div><div class="row"><div class="col">Net Price</div><div class="col">' + majorObj.quoteMajorLines.lineListPrice + '</div></div><div class="row"><div class="col">Service Level</div><div class="col">' +majorObj.serviceLevel.serviceLevel + '</div></div>'; 
							document.getElementById('quote_lines').innerHTML += lines;
							$compile(document.getElementById('quote_lines'))($scope);
						}
					} else {
						$window.alert("not present!Error occured " + response.statusCode);
					}
				})
				.error(function(){
					$window.alert("Error occured. try again later")
				})	
			}

			$scope.lastPage = function() {
				var offset= (($scope.total_number_of_pages-1)*$scope.max_rows_in_table)+1;
				$window.alert(offset);
				$scope.GetQuotes(offset);
			}

			$scope.firstPage = function() {
				$scope.GetQuotes(1);
			}

			$scope.PrepareQuoteSearch = function()
			{
				$scope.quote_offset = 1;
				$scope.page_number = 1;
				$scope.total_number_of_pages = 1;
				$scope.quote_search_is_on = true;
				$scope.quote_search_keyword = $scope.quote_search_keyword_input;
				$scope.SearchQuotes($scope.quote_search_keyword, $scope.quote_offset);
			}

			$scope.PrepareOrderSearch = function()
			{
				$scope.order_offset = 1;
				$scope.page_number = 1;
				$scope.total_number_of_pages = 1;
				$scope.order_search_is_on = true;
				$scope.order_search_keyword = $scope.order_search_keyword_input;
				$scope.SearchOrders($scope.order_search_keyword, $scope.order_offset);
			}

			$scope.SearchOrders = function(keyword, offset)
			{
				$http(
						{
							method : "GET",
							url : "http://ccrc-mobile-poc-01:3600/orderService/search?order_id=" + keyword + "&from=" + offset + "&limit=" + $scope.max_rows_in_table,
							headers : { "Authorization": $scope.auth_token, "Request-Id": $scope.reqgen() }
						})
						.success(function(response)
								{
							$scope.showOrders(response);
								});
			}

			$scope.showOrders = function(order_data)
			{
				var order_table = document.getElementById('order_table');
				order_table.innerHTML = '<div class="row header"><div class="col">ORDER ID</div><div class="col">BILL TO</div><div class="col price">NET PRICE</div></div>';
				$scope.total_number_of_pages = parseInt("" + order_data.totalRecords/$scope.max_rows_in_table);

				if(order_data.totalRecords % $scope.max_rows_in_table != 0) $scope.total_number_of_pages += 1;
				else if($scope.total_number_of_pages === 0) $scope.total_number_of_pages = 1;

				for(i = 0;i < $scope.min(order_data.data.length, $scope.max_rows_in_table);i++)
				{
					var order_number = order_data.data[i].orderId;
					if(typeof(order_data.data[i].billtoContactFirstName) !== 'undefined' && typeof(order_data.data[i].billtoContactLastName) !== 'undefined') var bill_to_name = order_data.data[i].billtoContactFirstName + " " + order_data.data[i].billtoContactLastName;
					else bill_to_name = "";
					if(typeof(order_data.data[i].billToRoleId) !== 'undefined') var bill_to_id = order_data.data[i].billToRoleId;
					else bill_to_id = "";
					var price = order_data.data[i].totalNetPrice;
					if(typeof(price) === 'undefined') price = "";

					var row = "";
					var bill_to_details = bill_to_name + " (" + bill_to_id + ")";
					if(bill_to_details === " ()") bill_to_details = "";
					row = "<div class='row'><div class='col'>" + order_number + "</div><div class='col'>" + bill_to_details + "</div><div class='col'>" + price + "</div></div>";

					order_table.innerHTML += row;
					$compile(document.getElementById('order_table'))($scope);
				}
			}

			$scope.SearchQuotes = function(keyword, offset)
			{
				$http(
						{
							method : "GET",
							url : "https://ccrc-sc-stg.cisco.com/ServiceContract/ccrcesservices/quotes?query={quoteNumber=" + keyword + "}&sort=last_modified&order=desc&limit=" + $scope.max_rows_in_table + "&offset=" + offset,
							headers : { "Authorization": $scope.auth_token, "Request-Id": $scope.reqgen()}
						})
						.success(function(response) {
							$scope.showQuotes(response);
						}
						);
			}

			$scope.set_color = function (isvalid) {
				if (isvalid === true) {
					return { color: 'green' }
				} else {
					return { color: 'red' }
				}
			}

			$scope.showQuotes = function(response)
			{
				var quote_table = document.getElementById('quote_table');
				$scope.quoteDetails=[];
				quote_table.innerHTML = '<div class="row header"><div class="col">QUOTE ID</div><div class="col">BILL TO</div><div class="col">PRICE</div></div>';
				$scope.total_number_of_pages = parseInt("" + response.totalRecords/$scope.max_rows_in_table);
				if(response.totalRecords % $scope.max_rows_in_table != 0) $scope.total_number_of_pages += 1;
				for(i = 0;i < response.data.length;i++)
				{
					var jsonfield= {};
					jsonfield.quote_number = response.data[i].quote_number;
					jsonfield.bill_to_name = response.data[i].bill_to_name;
					jsonfield.bill_to_id = response.data[i].bill_to_id;
					jsonfield.price = response.data[i].quote_amount;
					if(typeof(price) === 'undefined') jsonfield.price = "";
					if(response.data[i].status === "Invalid") jsonfield.valid = false 
					else jsonfield.valid = true;
					$scope.quoteDetails.push(jsonfield);
				} 
				var row = "<div class='row' ng-repeat='quote in quoteDetails'><div class='col'><a ng-click='loadQuoteDetails(quote.quote_number)' ng-style='set_color(quote.valid)'>{{quote.quote_number}}</a></div><div class='col' ng-style='set_color(quote.valid)'>{{quote.bill_to_name}} ({{quote.bill_to_id}})</div><div class='col' ng-style='set_color(quote.valid)'>{{quote.price}}</div></div>";
				quote_table.innerHTML += row;
				$compile(document.getElementById('quote_table'))($scope);
			}

			$scope.ToggleLeft = function()
			{
				$ionicSideMenuDelegate.toggleLeft();
			};
			$scope.LoadLoginUI();
				})
