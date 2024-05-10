from setuptools import setup

package_name = 'rover_robot'

setup(
    name=package_name,
    version='0.0.1',
    packages=[package_name],
    data_files=[
        ('share/ament_index/resource_index/packages',
            ['resource/' + package_name]),
        ('share/' + package_name, ['package.xml']),
    ],
    install_requires=['setuptools'],
    zip_safe=True,
    maintainer='turgay',
    maintainer_email='turgay@todo.todo',
    description='Rover Robot package',
    license='License',
    tests_require=['pytest'],
    entry_points={
        'console_scripts': [
            'static_robot_tf2_broadcaster = robot.static_robot_tf2_broadcaster:main',
        ],
    },
)
