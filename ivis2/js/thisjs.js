function makeData(dataset) {
    data = dataset;
    result = { "name": "flare", "children": [] };
    distinct_wave = [...new Set(data.map(x => x.waveDimension))];
    //create one level of flare
    distinct_wave.forEach(wave => {
        //32
        level1_children_obj = {};
        level1_children_obj["name"] = wave;
        level1_children_obj["children"] = [];
        wave_filter_result = data.filter(a => a.waveDimension == wave);

        distinct_year_per_wave = [... new Set(wave_filter_result.map(x => x.yearDimension))];
        distinct_year_per_wave.forEach(year => {
            levelonehalf_children_obj = {};
            levelonehalf_children_obj["name"] = year;
            levelonehalf_children_obj["children"] = [];
            year_filter_result = data.filter(a => a.waveDimension == wave && a.yearDimension == year);

            distinct_country_per_wave = [... new Set(year_filter_result.map(x => x.countryDimension))];
            distinct_country_per_wave.forEach(country => {
                level2_children_obj = {};
                level2_children_obj["name"] = country;
                country_filter_result = data.filter(a => a.countryDimension == country && a.waveDimension == wave && a.yearDimension == year);
                result2 = country_filter_result.map(x => { return { "name": x.ProfessionDimension, "value": x.valueDimension } });
                level2_children_obj["children"] = result2;
                levelonehalf_children_obj["children"].push(level2_children_obj);
            });
            level1_children_obj["children"].push(levelonehalf_children_obj);
        });
        result["children"].push(level1_children_obj);
    });
    return result;
}



function createFlare(containerId, apidata) {

    data = apidata;
    color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, data.children.length + 1));
    format = d3.format(",d");

    partition = data => {
        const root = d3.hierarchy(data)
            .sum(d => d.value)
            .sort((a, b) => b.value - a.value);
        return d3.partition()
            .size([2 * Math.PI, root.height + 1])
            (root);
    };

    width = 600;
    radius = width / 6;
    arc = d3.arc()
        .startAngle(d => d.x0)
        .endAngle(d => d.x1)
        .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
        .padRadius(radius * 1.5)
        .innerRadius(d => d.y0 * radius)
        .outerRadius(d => Math.max(d.y0 * radius, d.y1 * radius - 1));
    const root = partition(data);

    root.each(d => d.current = d);

    const svg = d3.select("#" + containerId)
        .append("svg")
        .style("width", "100%")
        .style("height", "100%")
        .style("font", "10px sans-serif");

    const g = svg.append("g")
        .attr("transform", `translate(${width / 2},${width / 2})`);

    const path = g.append("g")
        .selectAll("path")
        .data(root.descendants().slice(1))
        .join("path")
        .attr("fill", d => { while (d.depth > 1) d = d.parent; return color(d.data.name); })
        .attr("fill-opacity", d => arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0)
        .attr("d", d => arc(d.current));

    path.filter(d => d.children)
        .style("cursor", "pointer")
        .on("click", clicked);

    path.append("title")
        .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${format(d.value)}`);

    const label = g.append("g")
        .attr("pointer-events", "none")
        .attr("text-anchor", "middle")
        .style("user-select", "none")
        .selectAll("text")
        .data(root.descendants().slice(1))
        .join("text")
        .attr("dy", "0.35em")
        .attr("fill-opacity", d => +labelVisible(d.current))
        .attr("transform", d => labelTransform(d.current))
        .text(d => d.data.name);

    const parent = g.append("circle")
        .datum(root)
        .attr("r", radius)
        .attr("fill", "none")
        .attr("pointer-events", "all")
        .on("click", clicked);

    function clicked(p) {
        parent.datum(p.parent || root);

        root.each(d => d.target = {
            x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
            x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
            y0: Math.max(0, d.y0 - p.depth),
            y1: Math.max(0, d.y1 - p.depth)
        });

        const t = g.transition().duration(750);

        // Transition the data on all arcs, even the ones that aren’t visible,
        // so that if this transition is interrupted, entering arcs will start
        // the next transition from the desired position.
        path.transition(t)
            .tween("data", d => {
                const i = d3.interpolate(d.current, d.target);
                return t => d.current = i(t);
            })
            .filter(function (d) {
                return +this.getAttribute("fill-opacity") || arcVisible(d.target);
            })
            .attr("fill-opacity", d => arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0)
            .attrTween("d", d => () => arc(d.current));

        label.filter(function (d) {
            return +this.getAttribute("fill-opacity") || labelVisible(d.target);
        }).transition(t)
            .attr("fill-opacity", d => +labelVisible(d.target))
            .attrTween("transform", d => () => labelTransform(d.current));
    }

    function arcVisible(d) {
        return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
    }

    function labelVisible(d) {
        return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
    }

    function labelTransform(d) {
        const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
        const y = (d.y0 + d.y1) / 2 * radius;
        return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
    }
}

console.log("start");

createFlare("sunburst1-container", makeData(wave_year_country_emp_child));
createFlare("sunburst2-container", makeData(wave_year_country_profession_child));
createFlare("sunburst3-container", makeData(wave_year_country_educationAgeCompletion_childnum));
createFlare("sunburst4-container", makeData(wave_year_country_highestEducation_childnum));
createFlare("sunburst5-container", makeData(wave_year_country_educationAgeCompletion_childnum));
console.log("end");

openCity(event, 'byEmploymentStatus');

