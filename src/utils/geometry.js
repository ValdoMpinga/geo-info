L.GeometryUtil = L.extend(L.GeometryUtil || {}, {
    geodesicArea: function (latlngs)
    {
        var pointsCount = latlngs.length,
            area = 0.0,
            d2r = Math.PI / 180,
            p1, p2;

        if (pointsCount > 2)
        {
            for (var i = 0; i < pointsCount; i++)
            {
                p1 = latlngs[i];
                p2 = latlngs[(i + 1) % pointsCount];
                area += ((p2.lng - p1.lng) * d2r) *
                    (2 + Math.sin(p1.lat * d2r) + Math.sin(p2.lat * d2r));
            }
            area = area * 6378137.0 * 6378137.0 / 2.0;
        }

        return Math.abs(area);
    }
});
