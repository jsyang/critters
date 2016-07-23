![critters](assets/critters.png)

This page contains the development progress of [jsyang](http://www.jsyang.ca)'s entry for the
[/r/ProceduralGeneration July 2016 challenge](https://www.reddit.com/r/proceduralgeneration/comments/4rom1n/monthly_challenge_8_july_2016_procedural_creatures/).


Below are the steps I've taken to reach the end products with inline sub-steps to illustrate an
instance of running this simulation.

<script>
document.open();
</script>


At the end of all this I would like to end up with:
 - a full progression of steps leading to a set of procedurally generated creatures (sort of in a literate programming style)
 - a plausible world and environments that contain these creatures
 - most recent relationships between the different species (if any)
 - an evolutionary tree depicting the evolution of such creatures


## 1. World generation
Before we can start generating creatures, we need to define characteristics of the environments
they will live in. To do this we need to generate a world and then environments within that world
so the creatures that are created don't seem as contrived.

The world must contain some media for life to be viable. The three states of matter are solid,
liquid, gas. To simplify showing the areas of the world, we will represent it as a set of 2D tiles.
The tiles are color coded based on height.

This color scheme is based on the multi-hue color scheme on [Color Brewer 2](http://colorbrewer2.org/).

<script>
document.write(app.planet.get());

document.write(app.planet.getColorCSS());
</script>

As a side node: the range for each of the colors representing height is determined by quantizing the heights.

The next step to make this land mass distribution more realistic is to fast forward the process of equilibrium.
We must put it through several cycles of simulated erosion.

<script>
app.planet.erode();
document.write(app.planet.get());
</script>

## 2. Primordial soup
Before we can create plausible multi-cellular organisms, we must first think about the organisms
that came before them: the beginnings of life itself. How did it happen?

We can model the evolution of our system via the timeline of evolution as it is thought to have happened in
reality: [Timeline of the evolutionary history_of life](https://en.wikipedia.org/wiki/Timeline_of_the_evolutionary_history_of_life)

At this stage, we have a generated world which has gone through several stages of erosion, roughly corresponding to
the phase represented by *4100 - 3800 Ma* in this timeline.

## 3. Creature definition


<script>
document.close();
</script>