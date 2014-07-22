(function () {
    window.onload = function () {
        var html = '',
            map = document.getElementById('map-canvas'),
            latLng = new google.maps.LatLng(21.7679, 78.8718),
            infowindow, users = [],
            markers = []
            options = {
                center: latLng,
                zoom: 5,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                disableDefaultUI: true,
                zoomControl: true,
                disableDoubleClickZoom: true,
                scrollwheel: true,
            },
            map = new google.maps.Map(map, options);
        google.maps.Map.prototype.clearMarkers = function () {
            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(null);
            }
            markers = new Array();
        };

        $.getJSON("data.json", function (data) {
            $.each(data, function (key, user) {
                users.push(user);
                html += '<li class="row" data-id="' + key + '"><div class="col-md-4"><img src="' + (user.picture) + '"></div><div class="col-md-8"><span><a href="javascript:" class="m">' + (user.name) + '</a></span><br/><span>' + (user.team) + '</span><br/><span>' + (user.email) + '</span></div></li>';
                setTimeout(function () {
                    draw(user);
                }, 125 + (key * 125));
            });
            $("#results").html(html);

        });

        window.setTimeout(function () {
            $(".m").on("click", function () {

                map.clearMarkers();
               // $("#rp").prop("checked", true);
                $('#search').val($.trim($(this).text())).trigger('keyup');
            //    $("#rp").prop("checked", false);
            });


        }, 125);

        var draw = function (user) {
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(user.latitude, user.longitude),
                map: map,
                title: user.name + " (" + user.phone + ") ",
                animation: google.maps.Animation.DROP,
            });
            markers.push(marker);
            var contentString = '<div id="content">' +
                '<div id="siteNotice">' +
                '</div>' +
                '<h1 id="firstHeading" class="firstHeading" style="vertical-align: bottom;"><img style="margin-right: 39px;" src=' + user.picture + '/>' + user.name + '</h1>' +
                '<div id="bodyContent" style="border-top: 1px solid #787878; padding-top: 9px;">' +
                '<p><b>' + user.email + ' | ' + user.phone + '</b><br/>' + user.about + '</p>' +
                '</div>' +
                '</div>';
            google.maps.event.addListener(marker, 'click', function () {
                if (!infowindow) {
                    infowindow = new google.maps.InfoWindow();
                }
                infowindow.setContent(contentString);
                infowindow.open(map, marker);
            });

        };

        $('#search').delayKeyup(function (ele) {
           // var isChecked = $("#rp").is(":checked");
            //if (isChecked || $.trim($(ele).val()).length == 0)
            map.clearMarkers();
            var valThis = $(ele).val().toLowerCase();
            $('#results>li').each(function (key, val) {
                var text = $(this).text().toLowerCase();

                if (text.indexOf(valThis) >= 0) {
                    var _self = $(this);
                    _self.show();
                    //if (isChecked || $.trim($("#search").val()).length == 0) {
                        //setTimeout(function () {
                            draw(users[parseInt(_self.data("id"))]);
                        //}, 125 + (key * 125));
                    //}
                } else {
                    $(this).hide();
                }
            });
            // redraw the markers

        }, 1299);


        /*$("#rp").on("change", function () {
            if ($(this).is(":checked")) {
                $("#rplt").hide();
            } else {
                $("#rplt").show();
            }
        });
        $("#rplt").click(function () {
            $("#rp").prop("checked", true);
            if ($.trim($('#search').val()).length > 0) $('#search').trigger("keyup");
            $("#rp").prop("checked", false);
        });*/



    };
   
    (function ($) {
        $.fn.delayKeyup = function (callback, ms) {
            var timer = 0;
            $(this).keyup(function () {
                clearTimeout(timer);
                timer = setTimeout(callback($(this)), ms);
            });
            return $(this);
        };
    })(jQuery);

})();
