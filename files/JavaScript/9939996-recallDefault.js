function recall(thisfield, defaulttext) {
			if (thisfield.value == "") {
				thisfield.value = defaulttext;
				}
			}
			// the following goes in the text input line
			// onfocus="this.value= '';" onblur="recall(this,'Your email address');"
			// change 'Your email address' to any default text